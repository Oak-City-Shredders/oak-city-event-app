import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { LayoutItem } from '../data/homePageLayout';
import './CardLayout.css';
interface CardLayoutProps {
  items: LayoutItem[];
  handleCardClick: (route: string) => void;
}

const CardLayout: React.FC<CardLayoutProps> = ({ items, handleCardClick }) => {
  return (
    <IonGrid>
      <IonRow>
        {items.map((item: LayoutItem, index: number) => (
          <IonCol size="4" sizeLg="3" key={index}>
            <IonCard
              className="card"
              onClick={() => handleCardClick(item.route)}
            >
              <IonImg src={item.image} alt={item.title} />
              <IonCardHeader>
                <IonCardTitle className="card-title">{item.title}</IonCardTitle>
              </IonCardHeader>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
};

export default CardLayout;
