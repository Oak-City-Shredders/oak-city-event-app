import React from 'react';
import { IonContent, IonPage, IonCardSubtitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg } from '@ionic/react';
import PageHeader from '../components/PageHeader';

const About: React.FC = () => {
  return (
    <IonPage>
      <PageHeader color="tertiary" title="About" />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Another original creation built in the labs of the Mad Scientist</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonImg
              style={{ maxWidth: '300px', height: 'auto', display: 'block', margin: '0' }}
              src="/images/Jareds+Headshot.webp" alt="Mad Scientist" />
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Links</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Want to contribute? Find us on <a href="https://github.com/Oak-City-Shredders/oak-city-event-app" target="_blank" rel="noopener noreferrer">GitHub</a></p>
            <p>Learn more about <a href="https://www.oakcityshredfest.com/oak-city-about" target="_blank" rel="noopener noreferrer">Oak City Shredders</a></p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Credits</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p><b>Developers:</b> Jared Farago, David Wolf, Collin Chandler</p>
            <p><b>Testers:</b> Maya Wolf, Josh Christensen, Noah Via, Hannah Kenward Pope</p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default About;
