import { useEffect, useState, useCallback } from 'react';
import { App } from '@capacitor/app';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';

interface FireStoreDBHook<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useFireStoreDB<T>(
  collectionId: string,
  docId?: string
): FireStoreDBHook<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (docId) {
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
        }
      } else {
        const { snapshots } = await FirebaseFirestore.getCollection({
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
    } catch (error) {
      setError(error as Error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  // Fetch data on initial render
  useEffect(() => {
    // Fetch delivered notifications when app is resumed
    const appResumed = async () => {
      console.log('App resumed - fetching sheets data.');
      fetchData();
    };
    App.addListener('resume', appResumed);

    fetchData();

    return () => {
      App.removeAllListeners();
      console.log('home cleanup - all listeners removed');
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useFireStoreDB;
