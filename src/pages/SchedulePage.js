import React, { useMemo } from "react";
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
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Breadcrumb from "../components/Breadcrumb";
import useGoogleCalendar from "../hooks/useGoogleCalendar";
import LoadingSpinner from "../components/LoadingSpinner";
import { groupEventsByDays, isToday, getDayName } from "../utils/calenderUtils";

const CALENDAR_ID = process.env.REACT_APP_CALENDAR_ID;

const SchedulePage = () => {
  const { data: calendarData, loading, error } = useGoogleCalendar(CALENDAR_ID);
  const groupedEvents = useMemo(() => {
    return groupEventsByDays(calendarData);
  }, [calendarData]);

  return (
    <Container>
      <Breadcrumb name={"Schedule"} />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography>
          Error loading calendar data, please check back later.
        </Typography>
      ) : !calendarData || calendarData.length === 0 ? (
        <Typography>
          There are currently no events available.
        </Typography>
      ) : (
        Object.keys(groupedEvents).map((day) => (
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
                {groupedEvents[day].map((item, index) => (
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
                                {" at the " + item.location}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    {index < groupedEvents[day].length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
};

export default SchedulePage;
