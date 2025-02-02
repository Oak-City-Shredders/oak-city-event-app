// src/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import CardLayout from "../components/CardLayout";
import layout from "../data/homePageLayout.json";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Capacitor } from "@capacitor/core";
import useDeliveredNotifications from "../hooks/useDeliveredNotifications";

const HomePage = ({ notifications, notificationPermission }) => {
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
<Box sx={{ pb: 7 }}>
    <CardLayout items={layout} handleCardClick={handleCardClick} />
    <Box
      onClick={() => navigate("/notifications")}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "primary.main",
        color: "white",
        textAlign: "center",
        py: 2, // Padding top and bottom
        boxShadow: 3,
      }}
    >
        {  (Capacitor.isPluginAvailable("PushNotifications")) ? 
            <Typography variant="h6">Show Messages {"(" + notificationPermission + ")"} { notifications.length }</Typography>
            : ""
        }
  </Box>
</Box>
   
  );
};

export default HomePage;
