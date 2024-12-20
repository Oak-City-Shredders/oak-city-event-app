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

// Icon Configuration
const iconSize = 40;
const ICONS = {
  clinic: <SportsEsportsIcon sx={{ fontSize: iconSize, color: "#ff9914" }} />,
  beer: <SportsBarIcon sx={{ fontSize: iconSize, color: "#08bdbd" }} />,
  welcome: <AccessibilityIcon sx={{ fontSize: iconSize, color: "#29bf12" }} />,
  gateOpen: <LockOpenIcon sx={{ fontSize: iconSize, color: "#f21b3f" }} />,
  rumble: <SportsKabaddiIcon sx={{ fontSize: iconSize, color: "#5603ad" }} />,
  groupRide: (
    <SkateboardingIcon sx={{ fontSize: iconSize, color: "#fface4" }} />
  ),
  comingSoon: <AccessTimeIcon sx={{ fontSize: iconSize, color: "gray" }} />,
};

// API Configuration
const API_KEY = process.env.REACT_APP_API_KEY;
const CALENDAR_ID = process.env.REACT_APP_CALENDAR_ID;
const MAX_RESULTS = 1000;

// Helper Functions
const fetchEvents = async () => {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    CALENDAR_ID
  )}/events?key=${API_KEY}&maxResults=${MAX_RESULTS}&singleEvents=true&orderBy=startTime&timeMin=${new Date().toISOString()}`;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return { items: [] };
  }
};

const groupEventsByDays = (events) => {
  const grouped = {};
  events?.items?.forEach((event) => {
    const startDate = event.start.date || event.start.dateTime.split("T")[0];
    if (!grouped[startDate]) grouped[startDate] = [];

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(event.start.dateTime || event.start.date));

    grouped[startDate].push({
      title: event.summary || "",
      startTime: formattedTime,
      endTime: event.end.dateTime || event.end.date,
      description: event.description || "",
      location: event.location || "",
      icon: getIcon(event.summary),
    });
  });
  return grouped;
};

const getIcon = (eventTitle = "") => {
  const title = eventTitle.toLowerCase();
  switch (true) {
    case title.includes("clinic"):
      return ICONS.clinic;
    case title.includes("tour"):
      return ICONS.welcome;
    case title.includes("open"):
      return ICONS.gateOpen;
    default:
      return ICONS.comingSoon;
  }
};

const getDayName = (dateString) => {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    new Date(dateString + "T00:00:00")
  );
};

const isToday = (dateString) => {
  return new Date().toISOString().split("T")[0] === dateString;
};

// Main Component
const SchedulePage = () => {
  const [items, setItems] = React.useState({});

  React.useEffect(() => {
    const loadEvents = async () => {
      const rawEvents = await fetchEvents();
      const groupedEvents = groupEventsByDays(rawEvents);
      setItems(groupedEvents);
    };
    loadEvents();
  }, []);

  return (
    <Box sx={{ paddingTop: "5px", margin: "16px" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: "12px" }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Schedule</Typography>
      </Breadcrumbs>
      {Object.keys(items).map((day) => (
        <Accordion key={day} defaultExpanded={isToday(day)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${day}-content`}
            id={`${day}-header`}
            sx={{ paddingBottom: 0 }}
          >
            <Typography>{getDayName(day)}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <List sx={{ padding: 0 }}>
              {items[day].map((item, index) => (
                <Box key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon sx={{ alignSelf: "center", margin: 0 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.startTime}
                      secondary={
                        <>
                          <Typography
                            variant="body1"
                            color="text.primary"
                            component="span"
                          >
                            {item.title}
                          </Typography>
                          {item.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              component="span"
                            >
                              {" - " + item.description}
                            </Typography>
                          )}
                          {item.location && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              component="span"
                            >
                              {" at " + item.location}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < items[day].length - 1 && <Divider />}
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
