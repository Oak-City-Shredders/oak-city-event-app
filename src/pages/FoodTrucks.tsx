import React from 'react';
import {
  IonPage,
  IonContent
} from '@ionic/react';
import CardLayout from '../components/CardLayout';
import layout from '../data/foodTrucksLayout.json';
import PageHeader from '../components/PageHeader';

const FoodTrucks: React.FC = () => {
  const handleCardClick = (route: string): void => {
    window.open(route, '_blank');
  };

  return (
    <IonPage>
      <PageHeader title="Food Trucks" />
      <IonContent fullscreen>
        <CardLayout items={layout} handleCardClick={handleCardClick} />
      </IonContent>
    </IonPage>
  );
};

export default FoodTrucks;
