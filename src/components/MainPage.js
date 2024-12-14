import React from "react";
import { useNavigate } from "react-router-dom";
import CardLayout from "../components/CardLayout";
import items from "../data/mainPage.json";

const MainPage = () => {
  const navigate = useNavigate();
  const handleCardClick = (route) => {
    navigate(route);
  };

  return <CardLayout items={items} handleCardClick={handleCardClick} />;
};

export default MainPage;
