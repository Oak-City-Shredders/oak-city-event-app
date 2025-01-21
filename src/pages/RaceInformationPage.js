import React, { useMemo }  from "react";
import Breadcrumb from "../components/Breadcrumb";
import Container from "@mui/material/Container";
import useGoogleSheets from "../hooks/useGoogleSheets";
import LoadingSpinner from "../components/LoadingSpinner";
import Typography from "@mui/material/Typography";

const RaceInformationPage = () => {

  const SHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_RACING_INFO_ID;
  const RANGE = "Sheet1!A:C"; // Adjust range based on racer data (e.g., A:C for 3 columns)

  const { data: sheetsData, loading, error } = useGoogleSheets(SHEET_ID, RANGE);
  const groupedCategories = useMemo(() => {
    if (sheetsData) {
      const data = sheetsData.slice(1).map(([category, racer, team]) => ({ category, racer: { name: racer, team: team} })); //remove header row
      
      // Group racers by category
      const grouped = data.reduce((acc, { category, racer }) => {
        if (!acc[category]) acc[category] = [];
        acc[category].push(racer);
        return acc;
      }, {});

      // Convert to an array format
      return Object.entries(grouped).map(([name, racers], id) => ({
        id,
        name,
        racers,
      }));
    }
  }, [sheetsData]);

  return (
    <Container sx={{ mt: 2 }}>
      <Breadcrumb name={"Racing Info"} />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography>
          Error loading racing data, please check back later.
        </Typography>
      ) : !groupedCategories || groupedCategories.length === 0 ? (
        <Typography>
          There are currently no racers available to be shown.
        </Typography>
      ) : (
        groupedCategories.map((category) => (
          <div key={category.id} style={{ marginBottom: "20px" }}>
          <h2>{category.name}</h2>
          <ul>
            {category.racers.map((racer, index) => (
              <li key={index}>{racer.name} {(racer.team) ? "[" + racer.team + "]" : "" }</li>
            ))}
          </ul>
        </div>
        ))
      )}
    </Container>
  );
};

export default RaceInformationPage;
