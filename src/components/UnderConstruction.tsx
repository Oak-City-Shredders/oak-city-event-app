import React from 'react';
import { IonContent, IonPage, IonImg } from '@ionic/react';

const UnderConstruction: React.FC = () => {
  return (
    <IonImg
      src="/images/under-construction-small.webp"
      alt="Under Construction"
      //style={{ width: "100%" }}
    />
  );
};

export default UnderConstruction;
