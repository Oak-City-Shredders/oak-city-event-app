import React from "react";
import Container from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

const ScavengerHuntPage = () => {
  return (
    <Container sx={{ mt: 2 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          marginBottom: "12px",
          marginLeft: "18px",
        }}
      >
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Scavenger Hunt</Typography>
      </Breadcrumbs>
      <Card sx={{ m: 2 }}>
        <CardMedia
          component="img"
          height="225"
          image="/images/scavenger-hunt.webp"
          alt="Scavenger Hunt"
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Scavenger Hunt
          </Typography>
          <Typography variant="body1" sx={{ "margin-bottom": "24px" }}>
            Starting bright and early Thursday morning, the Scavenger Hunt kicks
            off and runs until the awards ceremony Saturday evening. Whether
            you’re a seasoned hunter or a first-timer, this is your chance to
            explore the entire property in search of hidden treasures!
          </Typography>
          <Typography variant="h6" gutterBottom>
            🎁 Prizes:
          </Typography>
          <Typography variant="body1" sx={{ "margin-bottom": "12px" }}>
            Prizes include awesome gear like ElectroLytes, WTF Rails, Function
            Wrist Guards, an MTE Hub, gift cards, rail guards, fenders, and swag
            bags packed with goodies!
          </Typography>
          <Typography variant="h6" gutterBottom>
            🌳 Where to Look:
          </Typography>
          <Typography variant="body1" sx={{ "margin-bottom": "12px" }}>
            The squirrels are scattered everywhere! From the Float Track to
            Stoke Park, and even down by the lake, you’ll need your wits, eyes,
            and maybe a little luck to find them all.
          </Typography>
          <Typography variant="h6" gutterBottom>
            🎨 What to Look For:
          </Typography>
          <Typography variant="body1" sx={{ "margin-bottom": "12px" }}>
            There are three different squirrel colors, each with unique prizes:
            <List>
              <ListItem>
                <ListItemText
                  primary="🟢 Green Squirrels: Win exciting prizes worth $50+ from Onewheel
            vendors!"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="🟡 Gold Squirrels: Score the big stuff with prizes valued
            at $150+!"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="🟣 Purple Squirrels: The real competition! The person who
            collects the most purple squirrels will snag an exclusive prize."
                />
              </ListItem>
            </List>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ScavengerHuntPage;
