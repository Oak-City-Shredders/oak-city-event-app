import { IonIcon } from '@ionic/react';
import {
  build,
  lockOpen,
  accessibility,
  alarm,
  volumeHigh,
  bonfire,
  pizza,
  beer,
  film,
} from 'ionicons/icons';
import { GoogleCalendarEvent } from '../hooks/useGoogleCalendar';

// Define types for the event and the grouped events
interface Event {
  start: {
    date: string;
    dateTime: string;
  };
  end: {
    date: string;
    dateTime: string;
  };
  summary: string;
  description: string;
  location: string;
}

interface GroupedEvents {
  [key: string]: {
    title: string;
    startTime: string;
    endTime: string;
    description: string;
    location: string;
    icon: JSX.Element;
  }[];
}

const iconSize = 40;

// Mapping of event title keywords to icon
const ICONS: Record<string, JSX.Element> = {
  clinic: <IonIcon aria-hidden="true" slot="start" icon={build} />,
  tour: <IonIcon aria-hidden="true" slot="start" icon={accessibility} />,
  open: <IonIcon aria-hidden="true" slot="start" icon={lockOpen} />,
  dj: <IonIcon aria-hidden="true" slot="start" icon={volumeHigh} />,
  fire: <IonIcon aria-hidden="true" slot="start" icon={bonfire} />,
  food: <IonIcon aria-hidden="true" slot="start" icon={pizza} />,
  beer: <IonIcon aria-hidden="true" slot="start" icon={beer} />,
  movie: <IonIcon aria-hidden="true" slot="start" icon={film} />,
};

// Function to group events by date
export const groupEventsByDays = (
  events: GoogleCalendarEvent[]
): GroupedEvents => {
  const grouped: GroupedEvents = {};

  events?.forEach((event) => {
    const startDate = event.start.date || event.start.dateTime.split('T')[0];
    if (!grouped[startDate]) grouped[startDate] = [];

    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(event.start.dateTime || event.start.date));

    grouped[startDate].push({
      title: event.summary || '',
      startTime: formattedTime,
      endTime: event.end.dateTime || event.end.date,
      description: event.description || '',
      location: event.location || '',
      icon: getIcon(event.summary),
    });
  });

  return grouped;
};

// Function to get the icon for a given event title
export const getIcon = (eventTitle: string = ''): JSX.Element => {
  const title = eventTitle.toLowerCase();

  // Return the icon if found, otherwise return the default
  return (
    ICONS[
      Object.keys(ICONS).find((key) => title.includes(key)) || 'default'
    ] || <IonIcon aria-hidden="true" slot="start" icon={alarm} />
  );
};

// Function to get the name of the day for a given date
export const getFormattedDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00'); // Interpret in local time
  const dayName = date.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: 'UTC', // Ensures the correct day name without shifting time zones
  });

  return `${dayName} - ${date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC', // Ensures consistency
  })}`;
};

// Function to check if the given date is today
export const isToday = (dateString: string): boolean => {
  return new Date().toISOString().split('T')[0] === dateString;
};
