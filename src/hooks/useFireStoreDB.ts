import { useEffect, useState, useCallback } from 'react';
import { App } from '@capacitor/app';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface FireStoreDBHook<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useFireStoreDB<T>(collectionId: string): FireStoreDBHook<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, collectionId));
      const items = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as T)
      );

      setData(items);
      console.log(items);
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
