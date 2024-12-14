import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import SkateboardingIcon from "@mui/icons-material/Skateboarding";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link as RouterLink } from "react-router-dom";

const iconSize = 40;
const clinicIcon = (
  <SportsEsportsIcon sx={{ fontSize: iconSize, color: "#ff9914" }} />
);
const beerIcon = (
  <SportsBarIcon sx={{ fontSize: iconSize, color: "#08bdbd" }} />
);
const welcomeIcon = (
  <AccessibilityIcon sx={{ fontSize: iconSize, color: "#29bf12" }} />
);
const gateOpenIcon = (
  <LockOpenIcon sx={{ fontSize: iconSize, color: "#f21b3f" }} />
);
const rumbleIcon = (
  <SportsKabaddiIcon sx={{ fontSize: iconSize, color: "#5603ad" }} />
);
const groupRideIcon = (
  <SkateboardingIcon sx={{ fontSize: iconSize, color: "#fface4" }} />
);
const comingSoonIcon = (
  <AccessTimeIcon sx={{ fontSize: iconSize, color: "gray" }} />
);

const items = [
  {
    day: "Thursday",
    items: [
      {
        time: "9:00 AM",
        title: "Gate Opens",
        description: "Check in at the front gate",
        icon: gateOpenIcon,
      },
      {
        time: "10:00 AM",
        title: "Welcome Tour",
        description: "with Supremo",
        icon: welcomeIcon,
      },
      {
        time: "11:00 PM",
        title: "Bonk Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "11:30 PM",
        title: "Drops Trick Clinic",
        description: "with Bodhi Harrison",
        icon: clinicIcon,
      },
      {
        time: "12:00 PM",
        title: "Beer Tent Opens",
        description: "provided by RBC",
        icon: beerIcon,
      },
      {
        time: "12:30 PM",
        title: "Curb Nudge Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "1:00 PM",
        title: "Body Varial Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "1:30 PM",
        title: "Queen City Rumble",
        description: "brought to you by the Charlotte Crew",
        icon: rumbleIcon,
      },
      {
        time: "3:00 PM",
        title: "Snir's Best Ride Ever ",
        description: "with the one and only",
        icon: groupRideIcon,
      },
      {
        time: "4:00 PM",
        title: "Afternoon Skate Jam",
        description: "Join the open jam session on the skate park ramps.",
        icon: comingSoonIcon,
      },
      {
        time: "5:00 PM",
        title: "Live DJ Set",
        description: "Enjoy beats from a local DJ to energize the crowd.",
        icon: comingSoonIcon,
      },
      {
        time: "6:00 PM",
        title: "Intermediate Skate Showdown",
        description: "Intermediate skaters battle it out for top honors.",
        icon: comingSoonIcon,
      },
      {
        time: "7:00 PM",
        title: "Dinner Break",
        description: "Grab some delicious bites from food trucks and vendors.",
        icon: comingSoonIcon,
      },
      {
        time: "8:00 PM",
        title: "Pro Skaters Showcase",
        description: "Watch the pros put on a breathtaking display of tricks.",
        icon: comingSoonIcon,
      },
      {
        time: "9:00 PM",
        title: "Nighttime Freestyle BMX Show",
        description: "BMX riders light up the park with jaw-dropping stunts.",
        icon: comingSoonIcon,
      },
      {
        time: "10:00 PM",
        title: "Best Trick Contest",
        description: "Showcase your best tricks under the lights for prizes.",
        icon: comingSoonIcon,
      },
      {
        time: "11:00 PM",
        title: "Awards Presentation",
        description: "Celebrate the top skaters and tricksters of the day.",
        icon: comingSoonIcon,
      },
      {
        time: "12:00 AM",
        title: "Closing Ceremony",
        description: "Wrap up the day with final thanks and a community toast.",
        icon: comingSoonIcon,
      },
    ],
  },
  {
    day: "Friday",
    items: [
      {
        time: "9:00 AM",
        title: "Gate Opens",
        description: "Check in at the front gate",
        icon: gateOpenIcon,
      },
      {
        time: "10:00 AM",
        title: "Welcome Tour",
        description: "with Supremo",
        icon: welcomeIcon,
      },
      {
        time: "11:00 PM",
        title: "Bonk Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "11:30 PM",
        title: "Drops Trick Clinic",
        description: "with Bodhi Harrison",
        icon: clinicIcon,
      },
      {
        time: "12:00 PM",
        title: "Beer Tent Opens",
        description: "provided by RBC",
        icon: beerIcon,
      },
      {
        time: "12:30 PM",
        title: "Curb Nudge Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "1:00 PM",
        title: "Body Varial Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "1:30 PM",
        title: "Queen City Rumble",
        description: "brought to you by the Charlotte Crew",
        icon: rumbleIcon,
      },
      {
        time: "3:00 PM",
        title: "Snir's Best Ride Ever ",
        description: "with the one and only",
        icon: groupRideIcon,
      },
      {
        time: "4:00 PM",
        title: "Afternoon Skate Jam",
        description: "Join the open jam session on the skate park ramps.",
        icon: comingSoonIcon,
      },
      {
        time: "5:00 PM",
        title: "Live DJ Set",
        description: "Enjoy beats from a local DJ to energize the crowd.",
        icon: comingSoonIcon,
      },
      {
        time: "6:00 PM",
        title: "Intermediate Skate Showdown",
        description: "Intermediate skaters battle it out for top honors.",
        icon: comingSoonIcon,
      },
      {
        time: "7:00 PM",
        title: "Dinner Break",
        description: "Grab some delicious bites from food trucks and vendors.",
        icon: comingSoonIcon,
      },
      {
        time: "8:00 PM",
        title: "Pro Skaters Showcase",
        description: "Watch the pros put on a breathtaking display of tricks.",
        icon: comingSoonIcon,
      },
      {
        time: "9:00 PM",
        title: "Nighttime Freestyle BMX Show",
        description: "BMX riders light up the park with jaw-dropping stunts.",
        icon: comingSoonIcon,
      },
      {
        time: "10:00 PM",
        title: "Best Trick Contest",
        description: "Showcase your best tricks under the lights for prizes.",
        icon: comingSoonIcon,
      },
      {
        time: "11:00 PM",
        title: "Awards Presentation",
        description: "Celebrate the top skaters and tricksters of the day.",
        icon: comingSoonIcon,
      },
      {
        time: "12:00 AM",
        title: "Closing Ceremony",
        description: "Wrap up the day with final thanks and a community toast.",
        icon: comingSoonIcon,
      },
    ],
  },
  {
    day: "Saturday",
    items: [
      {
        time: "9:00 AM",
        title: "Gate Opens",
        description: "Check in at the front gate",
        icon: gateOpenIcon,
      },
      {
        time: "10:00 AM",
        title: "Welcome Tour",
        description: "with Supremo",
        icon: welcomeIcon,
      },
      {
        time: "11:00 PM",
        title: "Bonk Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "11:30 PM",
        title: "Drops Trick Clinic",
        description: "with Bodhi Harrison",
        icon: clinicIcon,
      },
      {
        time: "12:00 PM",
        title: "Beer Tent Opens",
        description: "provided by RBC",
        icon: beerIcon,
      },
      {
        time: "12:30 PM",
        title: "Curb Nudge Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "1:00 PM",
        title: "Body Varial Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "1:30 PM",
        title: "Queen City Rumble",
        description: "brought to you by the Charlotte Crew",
        icon: rumbleIcon,
      },
      {
        time: "3:00 PM",
        title: "Snir's Best Ride Ever ",
        description: "with the one and only",
        icon: groupRideIcon,
      },
      {
        time: "4:00 PM",
        title: "Afternoon Skate Jam",
        description: "Join the open jam session on the skate park ramps.",
        icon: comingSoonIcon,
      },
      {
        time: "5:00 PM",
        title: "Live DJ Set",
        description: "Enjoy beats from a local DJ to energize the crowd.",
        icon: comingSoonIcon,
      },
      {
        time: "6:00 PM",
        title: "Intermediate Skate Showdown",
        description: "Intermediate skaters battle it out for top honors.",
        icon: comingSoonIcon,
      },
      {
        time: "7:00 PM",
        title: "Dinner Break",
        description: "Grab some delicious bites from food trucks and vendors.",
        icon: comingSoonIcon,
      },
      {
        time: "8:00 PM",
        title: "Pro Skaters Showcase",
        description: "Watch the pros put on a breathtaking display of tricks.",
        icon: comingSoonIcon,
      },
      {
        time: "9:00 PM",
        title: "Nighttime Freestyle BMX Show",
        description: "BMX riders light up the park with jaw-dropping stunts.",
        icon: comingSoonIcon,
      },
      {
        time: "10:00 PM",
        title: "Best Trick Contest",
        description: "Showcase your best tricks under the lights for prizes.",
        icon: comingSoonIcon,
      },
      {
        time: "11:00 PM",
        title: "Awards Presentation",
        description: "Celebrate the top skaters and tricksters of the day.",
        icon: comingSoonIcon,
      },
      {
        time: "12:00 AM",
        title: "Closing Ceremony",
        description: "Wrap up the day with final thanks and a community toast.",
        icon: comingSoonIcon,
      },
    ],
  },
  {
    day: "Sunday",
    items: [
      {
        time: "9:00 AM",
        title: "Gate Opens",
        description: "Check in at the front gate",
        icon: gateOpenIcon,
      },
      {
        time: "10:00 AM",
        title: "Welcome Tour",
        description: "with Supremo",
        icon: welcomeIcon,
      },
      {
        time: "11:00 PM",
        title: "Bonk Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "11:30 PM",
        title: "Drops Trick Clinic",
        description: "with Bodhi Harrison",
        icon: clinicIcon,
      },
      {
        time: "12:00 PM",
        title: "Beer Tent Opens",
        description: "provided by RBC",
        icon: beerIcon,
      },
      {
        time: "12:30 PM",
        title: "Curb Nudge Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "1:00 PM",
        title: "Body Varial Trick Clinic",
        description: "with The Mad Scientist",
        icon: clinicIcon,
      },
      {
        time: "1:30 PM",
        title: "Queen City Rumble",
        description: "brought to you by the Charlotte Crew",
        icon: rumbleIcon,
      },
      {
        time: "3:00 PM",
        title: "Snir's Best Ride Ever ",
        description: "with the one and only",
        icon: groupRideIcon,
      },
      {
        time: "4:00 PM",
        title: "Afternoon Skate Jam",
        description: "Join the open jam session on the skate park ramps.",
        icon: comingSoonIcon,
      },
      {
        time: "5:00 PM",
        title: "Live DJ Set",
        description: "Enjoy beats from a local DJ to energize the crowd.",
        icon: comingSoonIcon,
      },
      {
        time: "6:00 PM",
        title: "Intermediate Skate Showdown",
        description: "Intermediate skaters battle it out for top honors.",
        icon: comingSoonIcon,
      },
      {
        time: "7:00 PM",
        title: "Dinner Break",
        description: "Grab some delicious bites from food trucks and vendors.",
        icon: comingSoonIcon,
      },
      {
        time: "8:00 PM",
        title: "Pro Skaters Showcase",
        description: "Watch the pros put on a breathtaking display of tricks.",
        icon: comingSoonIcon,
      },
      {
        time: "9:00 PM",
        title: "Nighttime Freestyle BMX Show",
        description: "BMX riders light up the park with jaw-dropping stunts.",
        icon: comingSoonIcon,
      },
      {
        time: "10:00 PM",
        title: "Best Trick Contest",
        description: "Showcase your best tricks under the lights for prizes.",
        icon: comingSoonIcon,
      },
      {
        time: "11:00 PM",
        title: "Awards Presentation",
        description: "Celebrate the top skaters and tricksters of the day.",
        icon: comingSoonIcon,
      },
      {
        time: "12:00 AM",
        title: "Closing Ceremony",
        description: "Wrap up the day with final thanks and a community toast.",
        icon: comingSoonIcon,
      },
    ],
  },
];

const currentDayName = new Date().toLocaleString("en-US", { weekday: "long" });

const SchedulePage = () => {
  return (
    <Box sx={{ "padding-top": "5px", margin: "16px" }}>
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
        <Typography color="text.primary">Schedule</Typography>
      </Breadcrumbs>
      {items.map((day, index) => (
        <Accordion defaultExpanded={day.day === currentDayName}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{ "padding-bottom": "0" }}
          >
            <Typography>{day.day}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: "0" }}>
            <List sx={{ padding: "0" }}>
              {day.items.map((item, index) => (
                <Box>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.time}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body1"
                            sx={{ color: "text.primary", display: "inline" }}
                          >
                            {item.title}
                          </Typography>
                          {item.description ? (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ color: "text.primary", display: "inline" }}
                            >
                              {" - " + item.description}
                            </Typography>
                          ) : (
                            <span></span>
                          )}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < day.items.length - 1 ? <Divider /> : ""}
                </Box>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default SchedulePage;
