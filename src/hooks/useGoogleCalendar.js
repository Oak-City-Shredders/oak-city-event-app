import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;

function useGoogleCalendar(calendarId, maxResults = 500) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${API_KEY}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime&timeMin=${new Date().toISOString()}`;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (calendarId) fetchData();
  }, [calendarId, maxResults]);

  return { data, loading, error };
}

export default useGoogleCalendar;
