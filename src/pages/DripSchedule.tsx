import React from 'react';
import { IonLabel, IonText, IonCard, IonCardContent, IonContent, IonPage, IonItem, IonCardTitle, IonCardHeader, IonAccordion, IonAccordionGroup } from '@ionic/react';
import PageHeader from '../components/PageHeader';
import { useRef, useEffect } from 'react';
import useGoogleSheets from '../hooks/useGoogleSheets';
import { RefresherEventDetail, IonRefresher, IonRefresherContent } from '@ionic/react';

interface DripDay {
  isoDate: string;
  title: string;
  firstOutfit: string;
  secondOutfit: string;
  thirdOutfit: string;
}

const DripSchedule: React.FC = () => {
  const today = new Date();
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);

  const SHEET_ID = import.meta.env
    .VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
  const RANGE = 'DripSchedule!A:E'; // Adjust range based on racer data (e.g., A:C for 3 columns)

  const { data, loading, error, refetch } = useGoogleSheets(SHEET_ID, RANGE);

  const sheetDripSchedule: DripDay[] = !data
    ? []
    : data
      .slice(1) // Skip header row
      .map(([isoDate, title, firstOutfit, secondOutfit, thirdOutfit]: string[]) => ({
        isoDate,
        title,
        firstOutfit,
        secondOutfit,
        thirdOutfit
      }));

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from useGoogleSheets
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
