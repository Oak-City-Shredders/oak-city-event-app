import React from "react";
import { Container } from "@mui/material";
import Breadcrumb from "./Breadcrumb";

const MapPage = () => {
  return (
    <Container sx={{ mt: 2 }}>
      <Breadcrumb />
      <img
        width={"100%"}
        src="/images/lakeside-retreats-map.webp"
        alt="Lakeside Retreats map"
      />
    </Container>
  );
};

export default MapPage;
