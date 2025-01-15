import React from "react";
import { useNavigate } from "react-router-dom";
import CardLayout from "../components/CardLayout";
import layout from "../data/homePageLayout.json";

const HomePage = () => {
  const navigate = useNavigate();
  const handleCardClick = (route) => {
    navigate(route);
  };

  return <CardLayout items={layout} handleCardClick={handleCardClick} />;
};

export default HomePage;
