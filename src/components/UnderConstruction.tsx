import React from "react";
import { IonContent, IonPage, IonImg } from "@ionic/react";

const UnderConstruction: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonImg
          src="/images/under-construction-small.webp"
          alt="Under Construction"
          style={{ width: "100%" }}
        />
      </IonContent>
    </IonPage>
  );
};

export default UnderConstruction;