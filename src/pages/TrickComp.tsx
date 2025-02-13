import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import UnderConstruction from '../components/UnderConstruction';
import PageHeader from '../components/PageHeader';

const TrickCompPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title='Trick Comp' />
      <IonContent>
        <UnderConstruction />
      </IonContent>
    </IonPage>
  );
};

export default TrickCompPage;
