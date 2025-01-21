import { useEffect, useState } from "react";

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
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        setData(result.values);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (sheetId) fetchData();
  }, [sheetId]);

  return { data, loading, error };
}

export default useGoogleSheets;
