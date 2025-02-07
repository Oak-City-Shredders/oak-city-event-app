import { useEffect, useState } from "react";
import { fetchWithErrorHandling } from "../utils/fetchUtils";

const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_SHEETS_API_KEY as string;

interface GoogleSheetsHook {
  data: string[][] | null;
  loading: boolean;
  error: Error | null;
}

function useGoogleSheets(sheetId: string | undefined, range: string): GoogleSheetsHook {
  const [data, setData] = useState<string[][] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sheetId) {
      setError(new Error("Missing data configuration."));
      return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${API_KEY}`;

    const fetchData = async () => {
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
    };

    fetchData();
  }, [sheetId, range]);

  return { data, loading, error };
}

export default useGoogleSheets;
