import { useEffect, useState, useCallback, useRef } from 'react';
import { App } from '@capacitor/app';
import {
  FirebaseFirestore,
  QueryFilterConstraint,
} from '@capacitor-firebase/firestore';

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

function useFireStoreDB<T>(
  collectionId: string,
  docId?: string,
  where?: WhereCondition[],
  dependencies?: boolean[]
): FireStoreDBHook<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const cache = useRef<{ data: T[] | null; timestamp: number | null }>({
    data: null,
    timestamp: null,
  }); // Cache with timestamp

  const STALE_TIME = 60 * 1000; // 5 minutes in milliseconds

  const fetchData = useCallback(
    async (forceFetch = false) => {
      console.log('Fetching data');
      const now = Date.now();
      const isStale = cache.current.timestamp
        ? now - cache.current.timestamp > STALE_TIME
        : true;

      // Skip fetch if data is fresh and not forced
      if (cache.current.data && !forceFetch && !isStale) {
        setData(cache.current.data);
        return;
      }

      if (dependencies?.some((item) => !item)) {
        return;
      }

      setLoading(true);
      setError(null);
      try {
        if (docId) {
          const { snapshot } = await FirebaseFirestore.getDocument({
            reference: `${collectionId}/${docId}`,
          });
          if (snapshot.data) {
            const result = [{ id: docId, ...snapshot.data } as T];
            setData(result);
            cache.current = { data: result, timestamp: now }; // Update cache with timestamp
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
                  reference: collectionId,
                  compositeFilter: { type: 'and', queryConstraints },
                })
              : await FirebaseFirestore.getCollection({
                  reference: collectionId,
                });
          const items = snapshots.map(
            (doc) => ({ id: doc.id, ...doc.data } as T)
          );
          setData(items);
          cache.current = { data: items, timestamp: now }; // Update cache with timestamp
        }
        console.log('Fetch complete');
        setError(null);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setError(err);
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [collectionId, docId, where]
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
      setData(cache.current.data); // Use fresh cached data
    }

    // Fetch on app resume if data is stale
    const appResumed = async () => {
      console.log('App resumed');
      const currentTime = Date.now();
      const isDataStale = cache.current.timestamp
        ? currentTime - cache.current.timestamp > STALE_TIME
        : true;

      if (isMounted && !loading && (!cache.current.data || isDataStale)) {
        console.log('App resumed - fetching fresh data due to staleness');
        fetchData();
      } else if (cache.current.data) {
        console.log('App resumed - using cached data');
        setData(cache.current.data);
      }
    };
    App.addListener('resume', appResumed);

    return () => {
      isMounted = false;
      App.removeAllListeners();
    };
  }, [fetchData, loading, error]);

  // Refetch forces a new fetch, ignoring cache
  const refetch = useCallback(() => fetchData(true), [fetchData]);

  return { data, loading, error, refetch };
}

export default useFireStoreDB;
