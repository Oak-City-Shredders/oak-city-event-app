// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import SchedulePage from "./components/SchedulePage";
import MapPage from "./components/MapPage";
import FoodTrucksPage from "./components/FoodTrucksPage";

const App = () => {
  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding:
          "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      }}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/food-trucks" element={<FoodTrucksPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
