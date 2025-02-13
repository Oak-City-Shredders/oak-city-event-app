import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import CardLayout from '../components/CardLayout';
import layout from '../data/foodTrucksLayout.json';

const FoodTrucks: React.FC = () => {
  const handleCardClick = (route: string): void => {
    window.open(route, '_blank');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Food Trucks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <CardLayout items={layout} handleCardClick={handleCardClick} />
      </IonContent>
    </IonPage>
  );
};

export default FoodTrucks;
