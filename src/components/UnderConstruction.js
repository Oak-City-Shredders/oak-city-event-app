import React from "react";
import { Container } from "@mui/material";
import Breadcrumb from "./Breadcrumb";

const UnderConstruction = () => {
  return (
    <Container>
      <Breadcrumb name="Under Construction" />
      <img
        width={"100%"}
        src="/images/under-construction-small.webp"
        alt="food truck"
      />
    </Container>
  );
};

export default UnderConstruction;
