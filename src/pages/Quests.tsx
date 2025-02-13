import React, { useState } from 'react';
import {
  IonText,
  IonSpinner,
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonItem,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';
import useLocalStorage from '../hooks/useLocalStorage';
import useGoogleSheets from '../hooks/useGoogleSheets';
import { getErrorMessage } from '../utils/errorUtils';
import PageHeader from '../components/PageHeader';

interface Quest {
  id: number;
  text: string;
  completed: boolean;
}

const QuestsPage: React.FC = () => {
  const SHEET_ID = import.meta.env
    .VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
  const RANGE = 'Quests!A:B'; // Adjust range based on racer data (e.g., A:C for 3 columns)

  const { data, loading, error, refetch } = useGoogleSheets(SHEET_ID, RANGE);
  const [locallyStoredQuests, setQueststoLocalStorage] = useLocalStorage<
    Quest[]
  >('quests', []);

  const sheetQuestsUpdatedWithLocal: Quest[] = !data
    ? []
    : data
      .slice(1) // Skip header row
      .map(([id, text]: string[]) => ({
        id: Number(id),
        text,
        completed: false,
      }))
      .map((spreadSheetQuest: Quest) => {
        const localQuest = locallyStoredQuests.find(
          (q) => q.id === spreadSheetQuest.id
        );
        return localQuest
          ? { ...spreadSheetQuest, completed: localQuest.completed }
          : spreadSheetQuest;
      });

  const toggleQuestCompletion = (id: number) => {
    setQueststoLocalStorage(
      sheetQuestsUpdatedWithLocal.map((quest: Quest) =>
        quest.id === id ? { ...quest, completed: !quest.completed } : quest
      )
    );
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from useGoogleSheets
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  return (
    <IonPage>
      <PageHeader title="Side Quests" />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <IonCard>
          <img
            src="/images/quests-small.webp"
            alt="Quests"
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
            }}
          />
          <IonCardContent>
            <IonCardHeader>
              <IonCardTitle>Side Quests</IonCardTitle>
            </IonCardHeader>
            {loading ? (
              <IonSpinner name="dots" />
            ) : error ? (
              <IonText color="danger">
                <p>Error loading racing data, please check back later.</p>
                <p>{getErrorMessage(error)}</p>
              </IonText>
            ) : (
              <div>
                {sheetQuestsUpdatedWithLocal.map((quest: Quest) => (
                  <IonItem key={quest.id}>
                    <IonCheckbox
                      labelPlacement="start"
                      checked={quest.completed}
                      color="success"
                      onIonChange={() => toggleQuestCompletion(quest.id)}
                    >
                      {quest.text}
                    </IonCheckbox>
                  </IonItem>
                ))}
              </div>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default QuestsPage;
