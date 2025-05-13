import React from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useCurrentEvent } from '../context/CurrentEventContext';
import dayjs from 'dayjs';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { useRefreshHandler } from '../hooks/useRefreshHandler';
import { getErrorMessage } from '../utils/errorUtils';

interface EventItem {
  id: string;
  title: string;
  image: string;
  startDate: string; // ISO format
  endDate: string; // ISO format
}

const Events: React.FC = () => {
  const { setEventId } = useCurrentEvent();
  const history = useHistory();
  const now = dayjs();

  const {
    data: eventItems,
    loading,
    error,
    refetch,
  } = useFireStoreDB<EventItem>({
    collectionId: 'events',
    disableEventPrefix: true,
  });

  const eventsInProgress = eventItems
    ?.filter(
      (event) =>
        dayjs(event.startDate).isBefore(now) &&
        dayjs(event.endDate).isAfter(now)
    )
    .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate))); // earliest start first

  const upcomingEvents = eventItems
    ?.filter((event) => dayjs(event.startDate).isAfter(now))
    .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate))); // earliest start first

  const pastEvents = eventItems
    ?.filter((event) => dayjs(event.endDate).isBefore(now))
    .sort((a, b) => dayjs(b.endDate).diff(dayjs(a.endDate))); // most recent end first

  const handleEventSelect = (id: string) => {
    setEventId(id);
    history.push('/home');
  };

  const renderEventCard = (event: EventItem) => (
    <IonCard key={event.id} button onClick={() => handleEventSelect(event.id)}>
      <img alt={event.title} src={event.image} />
      <IonCardHeader>
        <IonCardTitle>{event.title}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );

  const handleRefresh = useRefreshHandler(refetch);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select an Event</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {loading ? (
          <IonSpinner name="dots" />
        ) : error ? (
          <IonText color="danger">
            <p>Error loading event data.</p>
            <p>{getErrorMessage(error)}</p>
          </IonText>
        ) : !eventItems || eventItems.length === 0 ? (
          <IonText>No events are currently available to be shown.</IonText>
        ) : (
          <>
            {eventsInProgress && eventsInProgress.length > 0 && (
              <>
                <IonText color="success">
                  <h2>Events in Progress</h2>
                </IonText>
                {eventsInProgress.map(renderEventCard)}
              </>
            )}

            {upcomingEvents && upcomingEvents.length > 0 && (
              <>
                <IonText color="primary">
                  <h2>Upcoming Events</h2>
                </IonText>
                {upcomingEvents.map(renderEventCard)}
              </>
            )}

            {pastEvents && pastEvents.length > 0 && (
              <>
                <IonText color="medium">
                  <h2>Past Events</h2>
                </IonText>
                {pastEvents.map(renderEventCard)}
              </>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Events;
