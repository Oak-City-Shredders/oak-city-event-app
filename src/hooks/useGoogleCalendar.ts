import { useEffect, useState } from "react";
import { fetchWithErrorHandling } from "../utils/fetchUtils";

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
}

function useGoogleCalendar(calendarId: string, maxResults: number = 500): UseGoogleCalendarReturn {
  const [data, setData] = useState<GoogleCalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!calendarId) return;
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${API_KEY}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime&timeMin=${new Date().toISOString()}`;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
     
        try {
          setLoading(true);
          const response = await fetchWithErrorHandling(url);
          const result = await response.json();
          setData(result.items); // Assuming the calendar response has an 'items' field
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error);
          } else {
            setError(new Error('An unknown error occurred'));
          }
        } finally {
          setLoading(false);
        }
      
    };

    fetchData();
  }, [calendarId, maxResults]);

  return { data, loading, error };
}

export default useGoogleCalendar;
