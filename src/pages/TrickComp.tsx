import React from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonText,
  IonCardContent,
} from '@ionic/react';
import UnderConstruction from '../components/UnderConstruction';
import PageHeader from '../components/PageHeader';
import NotificationToggle from '../components/NotificationToggle';

const TrickCompPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Trick Comp" />
      <IonContent>
        <IonCard>
          <img
            src="images/stokepark.webp"
            alt="Trick Comp"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '300px',
              objectFit: 'cover',
            }}
          />
          <IonCardContent>
            <IonText>
              <a
                href={
                  'https://www.oakcityshredfest.com/upgrades/p/trick-competition'
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{ whiteSpace: 'nowrap' }}
              >
                Get your trick competition ticket here
              </a>
            </IonText>
            <NotificationToggle topic="trick-comp" />
          </IonCardContent>
        </IonCard>
        <UnderConstruction />
      </IonContent>
    </IonPage>
  );
};

export default TrickCompPage;
