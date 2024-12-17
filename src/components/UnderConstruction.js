import React from "react";
import { Container } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

const UnderConstruction = () => {
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
        <Typography color="text.primary">Under Construction</Typography>
      </Breadcrumbs>
      <img
        width={"100%"}
        src="/images/under-construction-small.webp"
        alt="food truck"
      />
    </Container>
  );
};

export default UnderConstruction;
