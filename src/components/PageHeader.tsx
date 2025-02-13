import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/react';

interface PageHeaderProps {
  title: string;
  color?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, color }) => {
  return (
    <IonHeader>
      <IonToolbar color={color}>
        <IonButtons slot="start">
          <IonBackButton></IonBackButton>
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default PageHeader;
