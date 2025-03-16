import React from 'react';
import {
  IonLabel,
  IonIcon,
  IonCard,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  useIonRouter,
} from '@ionic/react';
import { calendar, timeOutline } from 'ionicons/icons';
import dayjs from 'dayjs';
import useGoogleCalendar from '../hooks/useGoogleCalendar'; // Assuming custom hook for Google Calendar

import './NextEvent.css';
interface NextEventProps {}
const NextEvent: React.FC<NextEventProps> = ({}) => {
  const router = useIonRouter();
  const { data: calendarData, loading, error, refetch } = useGoogleCalendar(5);

  function getFormattedTime(date: Date): string {
    return new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: undefined, // Use system default (12-hour or 24-hour)
    }).format(date);
  }

  if (loading || error || calendarData.length < 1) {
    return <></>;
  }

  const nextEvent = calendarData[0];
  const eventStartDateTime = new Date(nextEvent.start.dateTime);
  const eventEndDateTime = new Date(nextEvent.end.dateTime);
  const month = eventStartDateTime.toLocaleString('default', {
    month: 'short',
  });

  /*
  // This is a button that could be included in the widget but isn't needed now because schedule page is pretty limited
  
  <IonButton
    color={'medium'}
    fill="outline"
    slot="end"
    size={'small'}
    onClick={(e) => {
    e.stopPropagation();
    router.push('/schedule');
    }}
    >
    <IonIcon slot="start" icon={calendar}></IonIcon>
    View All Events
    </IonButton>
    */

  return (
    <IonCard onClick={undefined}>
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
        </div>
        <div
          className="event-bar-and-summary"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/schedule/up-next`);
          }}
        >
          <div className="event-vertical-bar"></div>
          <div className="calendar-event-summary-and-description">
            <div className="calendar-event-summary">{nextEvent.summary}</div>
            <div className="calendar-event-description">
              {nextEvent.description}
            </div>
            <div className="calendar-event-time">
              {' '}
              <IonIcon icon={timeOutline}></IonIcon>&nbsp;
              {`${getFormattedTime(eventStartDateTime)} - ${getFormattedTime(
                eventEndDateTime
              )}`}
            </div>
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default NextEvent;
