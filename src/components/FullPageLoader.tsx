import React from 'react';
import {
  IonContent,
  IonSpinner,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

import './FullPageLoader.css';

const FullPageLoader: React.FC = () => {
  return (
    <IonPage className="ion-page-full-loader">
      <IonContent fullscreen className="ion-content-loader">
        <IonGrid className="ion-height-full">
          <IonRow className="ion-align-items-center ion-justify-content-center ion-height-full">
            <IonCol size="12" className="ion-text-center">
              <div className="loader-container">
                <IonSpinner name="crescent" color="primary" />
                <p className="ion-margin-top">Loading...</p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default FullPageLoader;
