// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import SchedulePage from "./components/SchedulePage";
import MapPage from "./components/MapPage";
import FoodTrucksPage from "./components/FoodTrucksPage";
import EmergencyServicesPage from "./components/EmergencyServicesPage";
import RaceInformationPage from "./components/RaceInformationPage";
import ScavengerHuntPage from "./components/ScavengerHuntPage";
import RafflesGiveawaysPage from "./components/RafflesGiveawaysPage";

const RouteChangeWatcher = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 1);
  }, [location]);

  return null;
};

const App = () => {
  return (
    <Router>
      <RouteChangeWatcher />
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/scavenger-hunt" element={<ScavengerHuntPage />} />
        <Route path="/food-trucks" element={<FoodTrucksPage />} />
        <Route path="/emergency-services" element={<EmergencyServicesPage />} />
        <Route path="/race-information" element={<RaceInformationPage />} />
        <Route path="/raffles-giveaways" element={<RafflesGiveawaysPage />} />
      </Routes>
    </Router>
  );
};

export default App;
