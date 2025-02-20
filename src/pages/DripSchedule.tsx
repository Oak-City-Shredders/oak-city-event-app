import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import UnderConstruction from '../components/UnderConstruction';
import PageHeader from '../components/PageHeader';

const DripSchedule: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title='Drip Schedule' />
      <IonContent>
        <UnderConstruction />
      </IonContent>
    </IonPage>
  );
};

export default DripSchedule;
