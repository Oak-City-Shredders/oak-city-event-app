import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import UnderConstruction from "../components/UnderConstruction";

const TrickCompPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <UnderConstruction />
      </IonContent>
    </IonPage>
  );
};

export default TrickCompPage;