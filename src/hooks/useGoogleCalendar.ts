import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchWithErrorHandling } from '../utils/fetchUtils';
import { App } from '@capacitor/app';
import { useCurrentEvent } from '../context/CurrentEventContext';

const API_KEY = import.meta.env.VITE_REACT_APP_CALENDAR_API_KEY;

export interface GoogleCalendarEvent {
  summary: string;
  start: {
    dateTime: string;
    date: string;
  };
  end: {
    dateTime: string;
    date: string;
  };
  description?: string;
  location?: string;
}

interface UseGoogleCalendarReturn {
  data: GoogleCalendarEvent[];
  loading: boolean;
  syncing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getUpcomingEvents: () => GoogleCalendarEvent[];
}

function useGoogleCalendar(maxResults: number = 500): UseGoogleCalendarReturn {
  const [data, setData] = useState<GoogleCalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start with true for initial load
  const [syncing, setSyncing] = useState<boolean>(false); // For background refreshes
  const [initialFetchComplete, setInitialFetchComplete] =
    useState<boolean>(false); // Track if we've fetched at least once
  const [error, setError] = useState<Error | null>(null);

  const { eventInfo } = useCurrentEvent();
  const calendarId = useMemo(() => {
    if (eventInfo && eventInfo.calendarId) {
      return eventInfo.calendarId;
    }
    return null;
  }, [eventInfo]);

  const fetchData = useCallback(async () => {
    if (!calendarId) return;

    const now = new Date();
    const cutoffDate = new Date(eventInfo.startDate);
    const minDate = now < cutoffDate ? now : cutoffDate;
    const maxDate = new Date(eventInfo.endDate);

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${API_KEY}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime&timeMin=${minDate.toISOString()}&timeMax=${maxDate.toISOString()}`;

    // Set the appropriate loading state based on whether this is initial or refresh
    if (!initialFetchComplete) {
      setLoading(true); // Show "Loading" for initial fetch
    } else {
      setSyncing(true); // Show "Syncing" for subsequent fetches
    }
    setError(null);

    try {
      const response = await fetchWithErrorHandling(url);
      const result = await response.json();
      if (JSON.stringify(result.items) !== JSON.stringify(data)) {
        console.log('replace!');
        setData(result.items || []);
      }
      setInitialFetchComplete(true); // Mark that we've completed at least one fetch
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [calendarId, maxResults, initialFetchComplete]);

  // Get upcoming events from the already fetched data
  const getUpcomingEvents = useCallback(() => {
    const now = new Date();

    // Filter events that haven't started yet
    const futureEvents = data.filter((event) => {
      const eventStartTime = new Date(event.start.dateTime || event.start.date);
      return eventStartTime >= now;
    });

    if (futureEvents.length === 0) return [];

    // Sort by start time (should already be sorted from API, but just to be safe)
    const sortedEvents = [...futureEvents].sort((a, b) => {
      const aTime = new Date(a.start.dateTime || a.start.date).getTime();
      const bTime = new Date(b.start.dateTime || b.start.date).getTime();
      return aTime - bTime;
    });

    // Get the start time of the first upcoming event
    const firstEvent = sortedEvents[0];
    const firstEventStartTime = new Date(
      firstEvent.start.dateTime || firstEvent.start.date
    ).getTime();

    // Calculate the time window (one hour after the first event)
    const timeWindowEnd = firstEventStartTime + 60 * 60 * 1000; // One hour in milliseconds

    // Return all events that start within one hour of the first event
    return sortedEvents.filter((event) => {
      const eventStartTime = new Date(
        event.start.dateTime || event.start.date
      ).getTime();
      return eventStartTime <= timeWindowEnd;
    });
  }, [data]);

  // Fetch data on initial render
  useEffect(() => {
    let isMounted = true;
    fetchData();

    let appResumedListener: { remove: () => void };
    (async () => {
      const appResumed = async () => {
        console.log('App resumed (calendar)');

        if (isMounted) {
          console.log('App resumed - fetching fresh data (calendar)');
          // We'll fetch data here but won't set loading to true since initialFetchComplete will be true
          fetchData();
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
  }, [fetchData]);

  return {
    data,
    loading,
    syncing,
    error,
    refetch: fetchData,
    getUpcomingEvents,
  };
}

export default useGoogleCalendar;
