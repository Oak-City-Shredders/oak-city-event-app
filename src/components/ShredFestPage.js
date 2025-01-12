import React from "react";
import { useNavigate } from "react-router-dom";
import CardLayout from "../components/CardLayout";
import routes from "../data/routes.json";

const ShredFestPage = () => {
  const navigate = useNavigate();
  const handleCardClick = (route) => {
    navigate(route);
  };

  return <CardLayout items={routes} handleCardClick={handleCardClick} />;
};

export default ShredFestPage;
