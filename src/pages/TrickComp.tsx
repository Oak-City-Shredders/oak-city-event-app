import React from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonText,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/react';
import PageHeader from '../components/PageHeader';

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
            <IonCardTitle>Did you hear the news?</IonCardTitle>
            <IonCardSubtitle>
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
            </IonCardSubtitle>
            <div style={{ margin: '16px 0' }}>
              <IonText>
                Future Motion’s Race for the Rail is introducing a trick
                competition for the very first time—and Oak City Shredfest is
                making history as the first official qualifier!
              </IonText>
            </div>
            <div style={{ margin: '16px 0' }}>
              <IonText>
                That’s right! We’re stoked to announce that the champion of the
                Oak City Shredfest Trick Competition will not only score some
                epic prizes, but also lock in a spot to throw down with the best
                in the game at the first-ever RFTR Trick Comp!
              </IonText>
            </div>
            <div>
              <IonText>
                Think you’ve got what it takes? Prove it. Sign up now, show us
                your skills, and secure your shot to ride with the big dawgs! We
                can’t wait to see you there!
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default TrickCompPage;
