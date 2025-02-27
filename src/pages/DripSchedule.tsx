import React from 'react';
import { IonLabel, IonText, IonCard, IonCardContent, IonContent, IonPage, IonItem, IonCardTitle, IonCardHeader, IonAccordion, IonAccordionGroup } from '@ionic/react';
import UnderConstruction from '../components/UnderConstruction';
import PageHeader from '../components/PageHeader';
import { useRef, useEffect } from 'react';

const DripSchedule: React.FC = () => {
  const today = new Date();
  console.log(today.toISOString().split('T')[0]); // "YYYY-MM-DD" format
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);

  useEffect(() => {
    if (!accordionGroup.current) {
      return;
    }

    const nativeEl = accordionGroup.current;


    nativeEl.value = today.toISOString().split('T')[0];

  })


  return (
    <IonPage>
      <PageHeader title='Drip Schedule' />
      <IonContent>

        <IonCard>
          <img src="/images/drip-schedule.webp" alt="Drip Schedule" style={{ width: "100%", height: "auto", maxHeight: "300px", objectFit: "cover" }} />
          <IonCardContent>
            <IonText>The squirrels at Oak City Shred Fest love to have fun with clothes and costumes.  Join us and plan ahead using the schedule below.</IonText>

          </IonCardContent>
        </IonCard>

        <IonAccordionGroup ref={accordionGroup} value="thursday" >
          <IonAccordion value="2025-04-24">
            <IonItem slot="header" color="light">
              <IonLabel>THURSDAY 4/24 - Event or PEV shirt / Video Game character</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>What to wear:</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <ul><li>Your favorite past event shirt (Oak City, FloatLife Fest, Stokebird, etc.)
                    First-timer at Oak City? Rock your freshest PEV gear!
                    OG status? Break out the vintage merch from festivals past!</li>

                    <li>4:30PM - Downtown Boss Battle Ride at —what’s your Choose Your Own Avatar look?! 🎮🐿️</li>
                  </ul>
                </IonCardContent>
              </IonCard>
            </div>


          </IonAccordion>
          <IonAccordion value="2025-04-25">
            <IonItem slot="header" color="light">
              <IonLabel>FRIDAY 4/25 - Dress Bold / Embody Your inner Snir</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>What to wear:</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>

                  <ul>
                    <li>🏁 Time to Get Rowdy and Dress Bold!
                      It’s race day, trick comp day, and an all-out SEND IT day. No holding back—today is about going big, riding hard, and flexing your PEV personality!</li>

                    <li>The final "Snir’s Greatest Ride Ever" – Dress like Snir and roll out with the crew for this legendary ride! Let’s send it in Snir style!</li>
                  </ul>
                </IonCardContent>
              </IonCard>
            </div>


          </IonAccordion>
          <IonAccordion value="2025-04-26">
            <IonItem slot="header" color="light">
              <IonLabel>SATURDAY 4/26 – “Team Spirit Saturday”</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>What to wear:</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>

                  <ul>
                    <li>Your favorite PEV race jersey (Oak City, and partner jerseys are for sale on-site!)
                      Reppin’ a crew? Show your squad pride!
                      No team? No problem—Oak City is family. Grab a festival jersey and RIDE!</li>
                  </ul>
                </IonCardContent>
              </IonCard>
            </div>


          </IonAccordion>

        </IonAccordionGroup>

      </IonContent>
    </IonPage>
  );
};

export default DripSchedule;
