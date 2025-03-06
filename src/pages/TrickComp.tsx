import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import UnderConstruction from '../components/UnderConstruction';
import PageHeader from '../components/PageHeader';
import NotificationToggle from '../components/NotificationToggle';

const TrickCompPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Trick Comp" />
      <IonContent>
        <img src="images/stokepark.webp" alt="Trick Comp" />

        <NotificationToggle topic="trick-comp" />
        <UnderConstruction />
      </IonContent>
    </IonPage>
  );
};

export default TrickCompPage;
