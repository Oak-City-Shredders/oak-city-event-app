import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { App } from '@capacitor/app';
import { LOCAL_STORAGE__CURRENT_EVENT_ID_KEY } from '../constants/localStorageKeys';

export interface FireDBEventInfo {
  value: string;
  id: string;
}

interface CurrentEventContextType {
  eventId: string | null;
  setEventId: (id: string) => void;
  eventInfo: Record<string, any>;
  loadingEventInfo: boolean;
  errorEventInfo: any;
  refetchEventInfo: () => void;
}

const CurrentEventContext = createContext<CurrentEventContextType | undefined>(
  undefined
);

export const CurrentEventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [eventId, setEventIdState] = useState<string | null>(() => {
    return (
      localStorage.getItem(LOCAL_STORAGE__CURRENT_EVENT_ID_KEY) ||
      'ppXCuTLNIamQnZkwn5VC'
    );
  });

  const setEventId = (id: string) => {
    setEventIdState(id);
    localStorage.setItem(LOCAL_STORAGE__CURRENT_EVENT_ID_KEY, id);
  };

  const [data, setData] = useState<FireDBEventInfo[] | null>(null);
  const [loadingEventInfo, setLoading] = useState<boolean>(false);
  const [errorEventInfo, setError] = useState<Error | null>(null);
  const cache = useRef<{
    data: FireDBEventInfo[] | null;
    timestamp: number | null;
  }>({
    data: null,
    timestamp: null,
  }); // Cache with timestamp

  const STALE_TIME = 60 * 1000; // 5 minutes in milliseconds

  const fetchData = useCallback(
    async (forceFetch = false) => {
      console.log('Fetching Current Event data');
      console.log('Event ID:', eventId);
      const now = Date.now();
      const isStale = cache.current.timestamp
        ? now - cache.current.timestamp > STALE_TIME
        : true;

      // Skip fetch if data is fresh and not forced
      if (cache.current.data && !forceFetch && !isStale) {
        setData(cache.current.data);
        return;
      }

      const collectionIdPath = `${
        eventId ? `events/${eventId}/` : ''
      }EventInfo`;
      setLoading(true);
      setError(null);
      try {
        const { snapshots } = await FirebaseFirestore.getCollection({
          reference: collectionIdPath,
        });
        const items = snapshots.map(
          (doc) => ({ id: doc.id, ...doc.data } as FireDBEventInfo)
        );
        setData(items);
        cache.current = { data: items, timestamp: now }; // Update cache with timestamp

        setError(null);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setError(err);
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );

  // Fetch new data whenever eventId changes
  useEffect(() => {
    fetchData(true); // force fetch on eventId change
  }, [eventId]);

  useEffect(() => {
    let isMounted = true;

    // Check staleness on mount
    const now = Date.now();
    const isStale = cache.current.timestamp
      ? now - cache.current.timestamp > STALE_TIME
      : true;

    if (
      (!cache.current.data || isStale) &&
      isMounted &&
      !loadingEventInfo &&
      !errorEventInfo
    ) {
      fetchData();
    } else if (cache.current.data) {
      setData(cache.current.data); // Use fresh cached data
    }

    // Fetch on app resume if data is stale
    let appResumedListener: { remove: () => void }; // Type for the listener handle
    (async () => {
      const appResumed = async () => {
        console.log('App resumed');
        const currentTime = Date.now();
        const isDataStale = cache.current.timestamp
          ? currentTime - cache.current.timestamp > STALE_TIME
          : true;

        if (
          isMounted &&
          !loadingEventInfo &&
          (!cache.current.data || isDataStale)
        ) {
          console.log('App resumed - fetching fresh data due to staleness');
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
  }, [fetchData, loadingEventInfo, errorEventInfo]);

  // Refetch forces a new fetch, ignoring cache
  const refetchEventInfo = useCallback(() => fetchData(true), [fetchData]);

  const eventInfo = !data
    ? {}
    : Object.fromEntries(data.map(({ id, value }) => [id, value]));

  return (
    <CurrentEventContext.Provider
      value={{
        eventId,
        setEventId,
        eventInfo,
        loadingEventInfo,
        errorEventInfo,
        refetchEventInfo,
      }}
    >
      {children}
    </CurrentEventContext.Provider>
  );
};

export const useCurrentEvent = (): CurrentEventContextType => {
  const context = useContext(CurrentEventContext);
  if (!context) {
    throw new Error(
      'useCurrentEvent must be used within a CurrentEventProvider'
    );
  }
  return context;
};
