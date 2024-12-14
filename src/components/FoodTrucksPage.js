import React from 'react';
import { Typography, Container } from '@mui/material';

const FoodTrucksPage = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Schedule
      </Typography>
      <Typography variant="body1">
        Here is the schedule for the Oak City Shred Fest.
      </Typography>
    </Container>
  );
};

export default FoodTrucksPage;
