import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import UnderConstruction from '../components/UnderConstruction';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';

const TrickCompPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Trick Comp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <UnderConstruction />
      </IonContent>
    </IonPage>
  );
};

export default TrickCompPage;
