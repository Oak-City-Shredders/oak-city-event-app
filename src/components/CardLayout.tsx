import React from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonImg, IonGrid, IonRow, IonCol } from "@ionic/react";
import { LayoutItem } from "../data/homePageLayout";

interface CardLayoutProps {
  items: LayoutItem[];
  handleCardClick: (route: string) => void;
}

const CardLayout: React.FC<CardLayoutProps> = ({ items, handleCardClick }) => {
  return (
    <IonGrid>
      <IonRow className="safe-area">
        {items.map((item: LayoutItem, index: number) => (
          <IonCol size="12" sizeMd="6" sizeLg="3" key={index}>
            <IonCard onClick={() => handleCardClick(item.route)}>
              <IonImg src={item.image} alt={item.title} />
              <IonCardContent>
                <IonCardHeader>
                  <IonCardTitle>{item.title}</IonCardTitle>
                </IonCardHeader>
              </IonCardContent>
            </IonCard>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
};

export default CardLayout;