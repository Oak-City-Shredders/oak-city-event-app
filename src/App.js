// src/App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import MapPage from "./pages/MapPage";
import FoodTrucksPage from "./pages/FoodTrucksPage";
import EmergencyServicesPage from "./pages/EmergencyServicesPage";
import RaceInformationPage from "./pages/RaceInformationPage";
import ScavengerHuntPage from "./pages/ScavengerHuntPage";
import RafflesGiveawaysPage from "./pages/RafflesGiveawaysPage";
import DripSchedulePage from "./pages/DripSchedulePage";
import TrickCompPage from "./pages/TrickCompPage";
import QuestsPage from "./pages/QuestsPage";

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
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/scavenger-hunt" element={<ScavengerHuntPage />} />
        <Route path="/food-trucks" element={<FoodTrucksPage />} />
        <Route path="/emergency-services" element={<EmergencyServicesPage />} />
        <Route path="/race-information" element={<RaceInformationPage />} />
        <Route path="/raffles-giveaways" element={<RafflesGiveawaysPage />} />
        <Route path="/drip-schedule" element={<DripSchedulePage />} />
        <Route path="/trick-comp" element={<TrickCompPage />} />
        <Route path="/quests" element={<QuestsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
