import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

function Breadcrumb({ name }) {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Home
      </Link>
      <Typography color="text.primary">{name}</Typography>
    </Breadcrumbs>
  );
}

export default Breadcrumb;
