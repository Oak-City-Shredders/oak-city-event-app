import React from "react";
import Breadcrumb from "../components/Breadcrumb";

import { Container } from "@mui/material"
import CardLayout from "../components/CardLayout";
import layout from "../data/foodTrucksLayout.json";

const FoodTrucksPage = () => {
  const handleCardClick = (route) => {
    window.open(route)
  };
  return (
    <Container>
      <Breadcrumb name={"Food Trucks"} />
      <CardLayout items={layout} handleCardClick={handleCardClick} />
    </Container>
  );
};

export default FoodTrucksPage;

