import {
  IonContent,
  IonPage,
} from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import MyMap from '../components/Map';


interface RouteParams {
  locationName: string;
}

const MapPage: React.FC = () => {
  const { locationName } = useParams<RouteParams>();

  return (
    <IonPage>
      {/* <PageHeader title="Map" />
*/}

      <IonContent fullscreen >
        <MyMap centerOn={locationName} />
      </IonContent>
    </IonPage>
  );
};

export default MapPage;
