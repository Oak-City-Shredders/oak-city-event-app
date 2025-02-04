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
import NotificationsPage from "./pages/Notifications";
import useNotifications from "./hooks/useNotifications";

const RouteChangeWatcher = () => {
  const location = useLocation();

  useEffect(() => {
    //Scrolling down by 1 pixel can trigger the browser to adjust the layout and remove the address bar.
    window.scrollTo(0, 1);
  }, [location]);

  return null;
};


const App = () => {

  const { notifications, notificationPermission } = useNotifications(); 
  console.log("# of Notifications:", notifications.length);
  
  return (
    <Router>
      <RouteChangeWatcher />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage notifications={notifications} notificationPermission={notificationPermission}/>} />
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
        <Route path="/notifications" element={<NotificationsPage notifications={notifications}/>} />
      </Routes>
    </Router>
  );
};

export default App;
