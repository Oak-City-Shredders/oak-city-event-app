import { useEffect, useState, useCallback } from 'react';
import { App } from '@capacitor/app';
import {
  FirebaseFirestore,
  QueryFilterConstraint,
} from '@capacitor-firebase/firestore';
import { isFirebaseInitialized } from '../firebase';

// Define a type for where conditions
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
  firebaseAvailable: boolean;
}

function useFireStoreDB<T>(
  collectionId: string,
  docId?: string,
  where?: WhereCondition[], // Optional where parameter
  dependencies?: boolean[]
): FireStoreDBHook<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [firebaseAvailable, setFirebaseAvailable] = useState<boolean>(
    isFirebaseInitialized()
  );

  // Check if Firebase is available on mount and when dependencies change
  useEffect(() => {
    setFirebaseAvailable(isFirebaseInitialized());
  }, [dependencies]);

  const fetchData = useCallback(async () => {
    // Check if dependencies are met and Firebase is initialized
    if (dependencies?.some((item) => !item) || !isFirebaseInitialized()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (docId) {
        // Single document fetch (where clause doesn't apply)
        const { snapshot } = await FirebaseFirestore.getDocument({
          reference: `${collectionId}/${docId}`,
        });

        if (snapshot.data) {
          setData([
            {
              id: docId,
              ...snapshot.data,
            } as T,
          ]);
        } else {
          // Document exists but has no data
          setData([]);
        }
      } else {
        // Collection fetch with optional where conditions
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
                compositeFilter: {
                  type: 'and',
                  queryConstraints,
                },
              })
            : await FirebaseFirestore.getCollection({
                reference: collectionId,
              });
        const items = snapshots.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data,
            } as T)
        );

        setData(items);
      }
      setError(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err);
      console.error('Firestore error:', error);
    } finally {
      setLoading(false);
    }
  }, [collectionId, docId, where, dependencies]);

  // Fetch data on initial render and when Firebase status changes
  useEffect(() => {
    let isMounted = true;

    // Only attempt to fetch if Firebase is available
    if (isFirebaseInitialized()) {
      // Fetch delivered notifications when app is resumed
      const appResumed = async () => {
        if (isMounted && !loading) fetchData();
      };
      App.addListener('resume', appResumed);

      fetchData();
    } else {
      console.log('Firebase not initialized. Skipping Firestore fetch.');
    }

    return () => {
      isMounted = false;
      App.removeAllListeners();
    };
  }, [fetchData, firebaseAvailable]);

  return { data, loading, error, refetch: fetchData, firebaseAvailable };
}

export default useFireStoreDB;
