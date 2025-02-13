import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import UnderConstruction from '../components/UnderConstruction';
import PageHeader from '../components/PageHeader';

const Raffles: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Raffles & Giveaways" />
      <IonContent>
        <UnderConstruction />
      </IonContent>
    </IonPage>
  );
};

export default Raffles;
