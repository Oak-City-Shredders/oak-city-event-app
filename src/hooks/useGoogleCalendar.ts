import { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchWithErrorHandling } from '../utils/fetchUtils';
import { App } from '@capacitor/app';

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
  error: Error | null;
  refetch: () => Promise<void>;
  getUpcomingEvents: () => GoogleCalendarEvent[];
}

function useGoogleCalendar(
  maxResults: number = 500,
  calendarId: string = import.meta.env.VITE_REACT_APP_CALENDAR_ID || ''
): UseGoogleCalendarReturn {
  const [data, setData] = useState<GoogleCalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start with true for initial load
  const [initialFetchComplete, setInitialFetchComplete] =
    useState<boolean>(false); // Track if we've fetched at least once
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!calendarId) return;

    const now = new Date();
    const cutoffDate = new Date('2025-04-22T08:00:00-04:00');
    const minDate = now < cutoffDate ? now : cutoffDate;
    const maxDate = new Date('2025-04-28T08:00:00-04:00');

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${API_KEY}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime&timeMin=${minDate.toISOString()}&timeMax=${maxDate.toISOString()}`;

    // Only set loading to true if we haven't completed an initial fetch
    if (!initialFetchComplete) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetchWithErrorHandling(url);
      const result = await response.json();
      setData(result.items || []);
      setInitialFetchComplete(true); // Mark that we've completed at least one fetch
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
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

  return { data, loading, error, refetch: fetchData, getUpcomingEvents };
}

export default useGoogleCalendar;
