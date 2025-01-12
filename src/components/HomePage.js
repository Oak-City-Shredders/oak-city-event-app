import React from "react";
import { useNavigate } from "react-router-dom";
import CardLayout from "../components/CardLayout";
import cards from "../data/homePageCards.json";

const MainPage = () => {
  const navigate = useNavigate();
  const handleCardClick = (route) => {
    navigate(route);
  };

  return <CardLayout items={cards} handleCardClick={handleCardClick} />;
};

export default MainPage;
