import React from "react";
import Container from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import CardLayout from "./CardLayout";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PlaceIcon from "@mui/icons-material/Place";
import DateRangeIcon from "@mui/icons-material/DateRange";

const API_KEY = process.env.REACT_APP_API_KEY;
const CALENDAR_ID = process.env.REACT_APP_CALENDAR_ID;
const GROUP_RIDES = [
  {
    title: "2nd Sunday Slow Roll",
    description: `Slow Rolls are group rides for personal electric vehicles, friendly
          for newer riders. Riders under 16 must be with an adult. PLEASE WEAR A
          HELMET. PARK AT THE NCMA BUS PARKING LOT. The Slow Roll includes laps
          around NCMA, a greenway ride to Raleigh Brewing Company (RBC), and a
          return to NCMA. More riding may follow. Other rides are not Slow
          Rolls; newer riders should ask about routes before joining.`,
    location: "Art Museum",
    dateTime: "Jan 12 - 11 AM",
    image: "/images/group-rides-small.webp",
    speed: "8 - 10 mph",
  },
  {
    title: "Tuesday Slow Roll",
    description: `Beer sponsored by PONYSAURUS BREWING. Departure at 5:45 PM from Dix Park Parking Lot in front of the Flower Cottage. Meet at 5:00 at Joasis to PreGame, then head to Dix at 5:30. Ride is 12 miles through Dix, NC State Centennial Campus, Walnut Creek Greenway, and Lake Johnson. Rest at Lake Johnson Boat House for 15 minutes. Bring a charger if your range is less than 15 miles. Ride takes about 1.5 hours. After returning to Dix, optional night ride to Morgan Food Hall and downtown. Bring a charger and headlamp. Have fun, ride safe. Use a headset for music. `,
    location: "The Joasis",
    dateTime: "Every Tues - 5 PM",
    image: "/images/group-rides-small.webp",
    speed: "16 mph+",
  },
];

// Improve this
const getSpeedColor = (speed) => {
  if (speed === "8 - 10 mph") return "#24A80F";
  if (speed === "16 mph+") return "#FF0000";
  return "#000000";
};

const RideCard = ({ item }) => (
  <Card onClick={() => {}}>
    <CardActionArea>
      <Box position="relative">
        <CardMedia
          component="img"
          height="140"
          image={item.image}
          alt={item.title}
        />
        <Box
          sx={{
            top: 10,
            left: 10,
            borderRadius: 1,
            position: "absolute",
            fontSize: "13px",
            bgcolor: "white",
            marginRight: "4px",
            textAlign: "center",
            padding: "4px 6px",
            color: "#24A80F",
          }}
        >
          <Typography
            gutterBottom
            variant="caption"
            sx={{ fontWeight: "bold", color: getSpeedColor(item.speed) }}
          >
            {item.speed}
          </Typography>
        </Box>
      </Box>
      <CardContent>
        <Typography variant="h5" component="div">
          {item.title}
        </Typography>
        <Grid container>
          <Grid size={6}>
            <Typography
              gutterBottom
              variant="subtitle1"
              sx={{ color: "text.secondary", alignSelf: "center" }}
            >
              <PlaceIcon
                sx={{
                  fontSize: "13px",
                  color: "#24A80F",
                  marginRight: "4px",
                  marginLeft: "-1px",
                }}
              />
              {item.location}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography
              gutterBottom
              variant="subtitle1"
              sx={{ color: "text.secondary", alignSelf: "center" }}
              textAlign="right"
            >
              <DateRangeIcon
                sx={{
                  fontSize: "13px",
                  color: "#24A80F",
                  marginRight: "4px",
                }}
              />
              {item.dateTime}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {item.description}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const GroupRideCalendar = () => (
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
      <Typography color="text.primary">Group Rides</Typography>
    </Breadcrumbs>
    {/* <CardLayout items={GROUP_RIDES} handleCardClick={() => {}} /> */}
    <Box sx={{ p: 2, flexGrow: 1, paddingTop: 0 }}>
      <Grid container spacing={2} className="safe-area" sx={{ mt: 2 }}>
        {GROUP_RIDES.map((item, index) => (
          <RideCard key={index} item={item} />
        ))}
      </Grid>
    </Box>
  </Container>
);

export default GroupRideCalendar;
