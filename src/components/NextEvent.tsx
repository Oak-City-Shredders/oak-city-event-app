import React, { useEffect } from 'react';
import {
  IonLabel,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  useIonRouter,
} from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import dayjs from 'dayjs';
import useGoogleCalendar from '../hooks/useGoogleCalendar'; // Assuming custom hook for Google Calendar

import './NextEvent.css';
interface NextEventProps {}
const NextEvent: React.FC<NextEventProps> = ({}) => {
  const router = useIonRouter();
  const { loading, error, getUpcomingEvents } = useGoogleCalendar();

  const upcomingEvents = getUpcomingEvents();

  function getFormattedTime(date: Date): string {
    return new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: undefined, // Use system default (12-hour or 24-hour)
    }).format(date);
  }

  if (loading || error || upcomingEvents.length < 1) {
    return <></>;
  }

  const nextEvent = upcomingEvents[0];
  const eventStartDateTime = new Date(nextEvent.start.dateTime);
  const month = eventStartDateTime.toLocaleString('default', {
    month: 'short',
  });
  const dayOfWeek = eventStartDateTime.toLocaleString('default', {
    weekday: 'short',
  });

  return (
    <IonCard className="next-event-card" onClick={undefined}>
      <IonCardHeader className="event-card-header">
        <IonCardSubtitle>
          <div className="event-header">
            <IonLabel>
              {`Up Next in ${dayjs().to(
                new Date(nextEvent.start.dateTime),
                true
              )}`}{' '}
            </IonLabel>
          </div>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent className="event-card-content">
        <div className="calendar-icon">
          <div className="calendar-icon-header">{month}</div>
          <div className="calendar-icon-body">
            <div className="calendar-icon-day">
              {eventStartDateTime.getDate()}
            </div>
          </div>
          <div className="calendar-icon-footer">{dayOfWeek}</div>
        </div>
        <div className="events-container">
          {upcomingEvents.map((event, index) => {
            const eventStartDateTime = new Date(event.start.dateTime);
            const eventEndDateTime = new Date(event.end.dateTime);
            return (
              <div
                key={index}
                className="event-bar-and-summary"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/schedule`);
                }}
              >
                <div className="event-vertical-bar"></div>
                <div className="calendar-event-summary-and-description">
                  <div className="calendar-event-summary">{event.summary}</div>
                  <div className="calendar-event-description">
                    {event.description}
                  </div>
                  <div className="calendar-event-time">
                    {' '}
                    <IonIcon icon={timeOutline}></IonIcon>&nbsp;
                    {`${getFormattedTime(
                      eventStartDateTime
                    )} - ${getFormattedTime(eventEndDateTime)}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default NextEvent;
