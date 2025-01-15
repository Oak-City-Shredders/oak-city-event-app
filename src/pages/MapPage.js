import React from "react";
import Container from "@mui/material/Container";
import Breadcrumb from "../components/Breadcrumb";

const MapPage = () => {
  return (
    <Container>
      <Breadcrumb name={"Map"} />
      <img
        width={"100%"}
        src="/images/lakeside-retreats-map.webp"
        alt="Lakeside Retreats map"
      />
    </Container>
  );
};

export default MapPage;
