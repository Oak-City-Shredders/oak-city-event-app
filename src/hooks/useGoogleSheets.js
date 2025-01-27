import { useEffect, useState } from "react";
import { fetchWithErrorHandling } from '../utils/fetchUtils';

const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;

function useGoogleSheets(sheetId, range) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${API_KEY}`;
  
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchWithErrorHandling(url);
        const result = await response.json();

        setData(result.values);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (sheetId) {
      fetchData();
    } else {
      setError(new Error("Missing data configuration."));
    }
  }, [sheetId, range]);

  return { data, loading, error };
}

export default useGoogleSheets;
