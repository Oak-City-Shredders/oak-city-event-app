import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import UnderConstruction from '../components/UnderConstruction';
import PageHeader from '../components/PageHeader';

const EmergencyServices: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title='Emergency Services' />
      <IonContent>
        <UnderConstruction />
      </IonContent>
    </IonPage>
  );
};

export default EmergencyServices;
