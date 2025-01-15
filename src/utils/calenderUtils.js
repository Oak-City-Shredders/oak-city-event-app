import LockOpenIcon from "@mui/icons-material/LockOpen";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import SkateboardingIcon from "@mui/icons-material/Skateboarding";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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

export const groupEventsByDays = (events) => {
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

export const getIcon = (eventTitle = "") => {
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

export const getDayName = (dateString) => {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    new Date(dateString + "T00:00:00")
  );
};

export const isToday = (dateString) => {
  return new Date().toISOString().split("T")[0] === dateString;
};
