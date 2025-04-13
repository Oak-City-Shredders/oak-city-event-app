import React from 'react';
import {
  IonContent,
  IonPage,
  IonCardSubtitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonCol,
  IonGrid,
  IonRow,
  IonText,
} from '@ionic/react';
import PageHeader from '../components/PageHeader';
import AppInfo from '../components/AppInfo';

const CONTRIBUTORS = [
  {
    name: 'Jared Farago',
    nickname: 'The Mad Scientist',
    image:
      'https://firebasestorage.googleapis.com/v0/b/project3-449305.firebasestorage.app/o/team%2Fmad-scientist.webp?alt=media&token=f465463d-d75c-4bf7-90b0-19200117d9da',
    subtitle: 'Card Subtitle',
    description:
      'Co-founder of Oak City Onewheel, Co-creator of Oak City ElectroLytes, Director of the Scavenger Hunt, and App devoloper',
  },
  {
    name: 'David Wolf',
    nickname: 'The White Wolf',
    image:
      'https://firebasestorage.googleapis.com/v0/b/project3-449305.firebasestorage.app/o/team%2Fdave-wolf.webp?alt=media&token=e96519fd-6146-4a7c-b3bf-f8962afc55cd',
    subtitle: 'Card Subtitle',
    description: 'Treasurer of Oak City Onewheel and App developer',
  },
];

const About: React.FC = () => {
  return (
    <IonPage>
      <PageHeader color="tertiary" title="About" />
      <IonContent>
        <AppInfo />
        <IonGrid style={{ margin: '0 8px' }}>
          <IonRow>
            {CONTRIBUTORS.map((contributor, index) => (
              <IonCol size="6" key={index}>
                <IonCard style={{ height: '100%', margin: '4px' }}>
                  <img alt="Contributor headshot" src={contributor.image} />
                  <IonCardHeader style={{ paddingBottom: '8px' }}>
                    <IonCardTitle style={{ fontSize: '20px' }}>
                      {contributor.name}
                    </IonCardTitle>
                    <IonCardSubtitle style={{ fontSize: '10px' }}>
                      {contributor.nickname}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent style={{ paddingBottom: '4px' }}>
                    <IonText>
                      <p>{contributor.description}</p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonGrid style={{ margin: '0 8px' }}>
          <IonRow>
            <IonCol size="12">
              <IonCard style={{ margin: '0 4px' }}>
                <IonCardHeader>
                  <IonCardTitle>About Oak City Shred Fest</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    {' '}
                    <p>
                      Oak City Shred Fest is an annual PEV (Personal Electric
                      Vehicle) sports festival held in Raleigh, North Carolina.
                      Organized by Oak City Shredders, a charitable nonprofit,
                      the festival aims to spread the stoke, grow the community,
                      and cultivate partnerships through PEV education, events,
                      and competitions. The festival features a variety of
                      activities, including Onewheel racing, trick competitions,
                      live music, food trucks, camping, swimming, and group
                      rides. It's a fun-filled event that brings together riders
                      and enthusiasts from the community to celebrate their
                      passion for PEVs. This year's festival, Oak City Shred
                      Fest 5 (OCSF5), will take place from April 24–27, 2025.
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
              <IonCard style={{ margin: '16px 4px' }}>
                <IonCardHeader>
                  <IonCardTitle>Links</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>
                      Want to contribute? Find us on{' '}
                      <a
                        href="https://github.com/Oak-City-Shredders/oak-city-event-app"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    </p>
                    <p>
                      Learn more about{' '}
                      <a
                        href="https://www.oakcityshredfest.com/oak-city-about"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Oak City Shredders
                      </a>
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>

              <IonCard style={{ margin: '16px 4px' }}>
                <IonCardHeader>
                  <IonCardTitle>Credits</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText>
                    <p>
                      <b>Developers:</b> Jared Farago, David Wolf, Collin
                      Chandler
                    </p>
                    <p>
                      <b>Testers:</b> Maya Wolf, Josh Christensen, Noah Via,
                      Hannah Kenward Pope, Mark Grzyb
                    </p>
                    <p>
                      <b>Photos:</b> Special thanks to Cory @ArmorDilloz and
                      Alex Mononen for their amazing photos
                    </p>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default About;
