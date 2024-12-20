import React from "react";
import { Container } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

const MapPage = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          marginBottom: "12px",
          marginLeft: "0",
        }}
      >
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Map</Typography>
      </Breadcrumbs>
      <img
        width={"100%"}
        src="/images/lakeside-retreats-map.webp"
        alt="Lakeside Retreats map"
      />
    </Container>
  );
};

export default MapPage;
