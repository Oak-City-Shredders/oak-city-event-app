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
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useCurrentEvent } from '../context/CurrentEventContext';

const Events: React.FC = () => {
  const { setEventId } = useCurrentEvent();
  const history = useHistory();

  const handleEventSelect = (id: string) => {
    setEventId(id);
    history.push('/home'); // or replace with your actual homepage route
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select an Event</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard
          button
          onClick={() => handleEventSelect('9jDzcywCjsrsbZ1q1OBk')}
        >
          <img
            alt="Casual Camp Out Logo"
            src="images/casual-campout/casual-campout-banner.webp"
          />

          <IonCardHeader>
            <IonCardTitle>Casual Camp Out</IonCardTitle>
          </IonCardHeader>
        </IonCard>

        <IonCard button onClick={() => handleEventSelect('')}>
          <img
            alt="Shred Fest Logo"
            src="images/shred-fest-logo.webp"
            style={{ padding: '8px', background: '#4B1067' }}
          />
          <IonCardHeader>
            <IonCardTitle>Oak City Shred Fest</IonCardTitle>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Events;
