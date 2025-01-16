import React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";

const CardLayout = ({ items, handleCardClick }) => {
  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2} className="safe-area">
        {items.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Card
              onClick={() => handleCardClick(item.route)}
              sx={{ width: "100%" }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {item.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CardLayout;
