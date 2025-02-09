import { useEffect, useState, useCallback } from "react";
import { fetchWithErrorHandling } from "../utils/fetchUtils";

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_SHEETS_API_KEY as string;

interface GoogleSheetsHook {
  data: string[][] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>; // Add refetch function to interface
}

function useGoogleSheets(sheetId: string | undefined, range: string): GoogleSheetsHook {
  const [data, setData] = useState<string[][] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!sheetId) {
      setError(new Error("Missing data configuration."));
      return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${API_KEY}`;

    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithErrorHandling(url);
      const result = await response.json();
      setData(result.values || null);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [sheetId, range]);

  // Fetch data on initial render
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useGoogleSheets;
