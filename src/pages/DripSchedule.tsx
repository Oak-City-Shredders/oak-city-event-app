import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import UnderConstruction from '../components/UnderConstruction';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';

const DripSchedule: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Drip Schedule</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <UnderConstruction />
      </IonContent>
    </IonPage>
  );
};

export default DripSchedule;
