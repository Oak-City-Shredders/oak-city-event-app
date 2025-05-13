import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
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

type State = {
  data: FireDBEventInfo[] | null;
  loading: boolean;
  error: Error | null;
  timestamp: number | null;
};

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: FireDBEventInfo[]; timestamp: number }
  | { type: 'FETCH_ERROR'; payload: Error };

const initialState: State = {
  data: null,
  loading: false,
  error: null,
  timestamp: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START': {
      console.log('Fetching data...');
      return { ...state, loading: true, error: null };
    }
    case 'FETCH_SUCCESS':
      return {
        data: action.payload,
        loading: false,
        error: null,
        timestamp: action.timestamp,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export const CurrentEventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [eventId, setEventIdState] = React.useState<string | null>(() => {
    return (
      localStorage.getItem(LOCAL_STORAGE__CURRENT_EVENT_ID_KEY) ||
      'ppXCuTLNIamQnZkwn5VC'
    );
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  const setEventId = (id: string) => {
    setEventIdState(id);
    localStorage.setItem(LOCAL_STORAGE__CURRENT_EVENT_ID_KEY, id);
  };

  const STALE_TIME = 60 * 1000;

  const fetchData = useCallback(
    async (forceFetch = false) => {
      const now = Date.now();
      const isStale = state.timestamp
        ? now - state.timestamp > STALE_TIME
        : true;

      if (state.data && !forceFetch && !isStale) {
        console.log('Using cached data');
        return;
      }

      dispatch({ type: 'FETCH_START' });
      try {
        const collectionIdPath = `${
          eventId ? `events/${eventId}/` : ''
        }EventInfo`;
        const { snapshots } = await FirebaseFirestore.getCollection({
          reference: collectionIdPath,
        });
        const items = snapshots.map(
          (doc) => ({ id: doc.id, ...doc.data } as FireDBEventInfo)
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: items, timestamp: now });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        dispatch({ type: 'FETCH_ERROR', payload: err });
      }
    },
    [eventId, state.data, state.timestamp]
  );

  useEffect(() => {
    fetchData(true);
  }, [eventId]);

  useEffect(() => {
    const appResumed = async () => {
      const now = Date.now();
      const isStale = state.timestamp
        ? now - state.timestamp > STALE_TIME
        : true;

      if (!state.data || isStale) {
        console.log('App resumed - fetching fresh data');
        fetchData();
      }
    };

    const addListener = async () => {
      const listener = await App.addListener('resume', appResumed);
      return () => listener.remove();
    };

    const cleanupPromise = addListener();
    return () => {
      cleanupPromise.then((cleanup) => cleanup());
    };
  }, [fetchData, state.data, state.timestamp]);

  const refetchEventInfo = useCallback(() => fetchData(true), [fetchData]);

  const eventInfo = !state.data
    ? {}
    : Object.fromEntries(state.data.map(({ id, value }) => [id, value]));

  return (
    <CurrentEventContext.Provider
      value={{
        eventId,
        setEventId,
        eventInfo,
        loadingEventInfo: state.loading,
        errorEventInfo: state.error,
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
