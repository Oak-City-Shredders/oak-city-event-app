import React from 'react';
import { IonLabel, IonText, IonCard, IonCardContent, IonContent, IonPage, IonItem, IonCardTitle, IonCardHeader, IonAccordion, IonAccordionGroup } from '@ionic/react';
import PageHeader from '../components/PageHeader';
import { useRef, useEffect } from 'react';
import { RefresherEventDetail, IonRefresher, IonRefresherContent } from '@ionic/react';
import useFireStoreDB from '../hooks/useFireStoreDB';

interface DripDay {
  isoDate: string;
  title: string;
  firstOutfit: string;
  secondOutfit: string;
  thirdOutfit: string;
}

interface FireDBDripDay {
  Date: string;
  "First Outfit": string;
  "Second Outfit": string;
  "Third Outfit": string;
  "Title": string;
  id: string;
}

const DripSchedule: React.FC = () => {
  const today = new Date();
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);

  const { data, loading, error, refetch } = useFireStoreDB<FireDBDripDay>("DripSchedule");

  const sheetDripSchedule: DripDay[] = !data
    ? []
    : data
      .filter(drip => drip.Date)
      .map((drip) => ({
        isoDate: drip.Date,
        title: drip.Title,
        firstOutfit: drip['First Outfit'],
        secondOutfit: drip['Second Outfit'],
        thirdOutfit: drip['Third Outfit']
      }));

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from firedb
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <IonCard>
          <img src="/images/drip-schedule-small.webp" alt="Drip Schedule" style={{ width: "100%", height: "auto", maxHeight: "300px", objectFit: "cover" }} />
          <IonCardContent>
            <IonText>The squirrels at Oak City Shred Fest love to have fun with clothes and costumes.  Join us and plan ahead using the schedule below.</IonText>
          </IonCardContent>
        </IonCard>

        <IonAccordionGroup ref={accordionGroup}  >
          {sheetDripSchedule.map(d => (
            <IonAccordion key={d.isoDate} value={d.isoDate}>
              <IonItem slot="header" color="light">
                <IonLabel>{d.title}</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>What to wear:</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <ul>
                      <li>{d.firstOutfit}</li>
                      {d.secondOutfit && <li>{d.secondOutfit}</li>}
                      {d.thirdOutfit && <li>{d.thirdOutfit}</li>}
                    </ul>
                  </IonCardContent>
                </IonCard>
              </div>
            </IonAccordion>))}
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  );
};

export default DripSchedule;
