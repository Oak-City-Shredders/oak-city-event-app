import { useEffect, useState, useCallback, useRef } from 'react';
import { App } from '@capacitor/app';
import {
  FirebaseFirestore,
  QueryFilterConstraint,
} from '@capacitor-firebase/firestore';
import { useCurrentEvent } from '../context/CurrentEventContext';

type WhereCondition = {
  field: string;
  operator:
    | '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'in'
    | 'array-contains'
    | 'array-contains-any';
  value: any;
};

interface FireStoreDBHook<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface FireStoreDBOptions {
  collectionId: string;
  docId?: string;
  where?: WhereCondition[];
  dependencies?: boolean[];
  disableEventPrefix?: boolean;
}

// Overload 1: Old-style positional arguments
function useFireStoreDB<T>(
  collectionId: string,
  docId?: string,
  where?: WhereCondition[],
  dependencies?: boolean[]
): FireStoreDBHook<T>;

// Overload 2: New-style config object
function useFireStoreDB<T>(options: FireStoreDBOptions): FireStoreDBHook<T>;

// Implementation
function useFireStoreDB<T>(
  arg1: string | FireStoreDBOptions,
  arg2?: string,
  arg3?: WhereCondition[],
  arg4?: boolean[]
): FireStoreDBHook<T> {
  // Normalize to config object
  const config: FireStoreDBOptions =
    typeof arg1 === 'string'
      ? {
          collectionId: arg1,
          docId: arg2,
          where: arg3,
          dependencies: arg4,
        }
      : arg1;

  const {
    collectionId,
    docId,
    where,
    dependencies,
    disableEventPrefix = false,
  } = config;

  const { eventId } = useCurrentEvent();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const cache = useRef<{ data: T[] | null; timestamp: number | null }>({
    data: null,
    timestamp: null,
  });

  const STALE_TIME = 60 * 1000; // 1 minute

  const fetchData = useCallback(
    async (forceFetch = false) => {
      const now = Date.now();
      const isStale = cache.current.timestamp
        ? now - cache.current.timestamp > STALE_TIME
        : true;

      if (cache.current.data && !forceFetch && !isStale) {
        setData(cache.current.data);
        return;
      }

      if (dependencies?.some((item) => !item)) {
        return;
      }

      const collectionIdPath = disableEventPrefix
        ? collectionId
        : eventId
        ? `events/${eventId}/${collectionId}`
        : collectionId;

      setLoading(true);
      setError(null);

      try {
        if (docId) {
          const { snapshot } = await FirebaseFirestore.getDocument({
            reference: `${collectionIdPath}/${docId}`,
          });
          if (snapshot.data) {
            const result = [{ id: docId, ...snapshot.data } as T];
            setData(result);
            cache.current = { data: result, timestamp: now };
          }
        } else {
          const queryConstraints =
            where?.map(
              (condition) =>
                ({
                  type: 'where',
                  fieldPath: condition.field,
                  opStr: condition.operator,
                  value: condition.value,
                } as QueryFilterConstraint)
            ) || [];

          const { snapshots } =
            queryConstraints.length > 0
              ? await FirebaseFirestore.getCollection({
                  reference: collectionIdPath,
                  compositeFilter: { type: 'and', queryConstraints },
                })
              : await FirebaseFirestore.getCollection({
                  reference: collectionIdPath,
                });

          const items = snapshots.map(
            (doc) => ({ id: doc.id, ...doc.data } as T)
          );
          setData(items);
          cache.current = { data: items, timestamp: now };
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [collectionId, docId, where, dependencies, eventId, disableEventPrefix]
  );

  useEffect(() => {
    let isMounted = true;

    // Check staleness on mount
    const now = Date.now();
    const isStale = cache.current.timestamp
      ? now - cache.current.timestamp > STALE_TIME
      : true;

    if ((!cache.current.data || isStale) && isMounted && !loading && !error) {
      fetchData();
    } else if (cache.current.data) {
      setData(cache.current.data);
    }

    let appResumedListener: { remove: () => void };
    (async () => {
      const appResumed = async () => {
        const currentTime = Date.now();
        const isDataStale = cache.current.timestamp
          ? currentTime - cache.current.timestamp > STALE_TIME
          : true;

        if (isMounted && !loading && (!cache.current.data || isDataStale)) {
          fetchData();
        } else if (cache.current.data) {
          console.log('App resumed - using cached data');
          setData(cache.current.data);
        }
      };
      appResumedListener = await App.addListener('resume', appResumed);
    })();

    return () => {
      isMounted = false;
      if (appResumedListener) {
        appResumedListener.remove();
      }
    };
  }, [fetchData, loading, error]);

  // Refetch forces a new fetch, ignoring cache
  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, refetch };
}

export default useFireStoreDB;
