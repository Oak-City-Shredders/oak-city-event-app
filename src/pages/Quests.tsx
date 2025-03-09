import React, { useEffect, useState } from 'react';
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
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { qrCodeOutline } from 'ionicons/icons';
import useLocalStorage from '../hooks/useLocalStorage';
import { getErrorMessage } from '../utils/errorUtils';
import PageHeader from '../components/PageHeader';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { useParams } from 'react-router';
import QuestItem, { Quest } from '../components/QuestItem';
import './Quests.css';

// Add your sound file in the public folder or use a URL to the sound
interface FireDBQuest {
  ID: string;
  Quest: string;
  id: string;
  requiresScan: string; // If true, the quest requires scanning
  scanValue: string; // Expected barcode value for completion
}

const QuestsPage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  console.log('questId: ', questId);
  const [animate, setAnimate] = useState<number | null>(null);
  console.log('animation: ', animate);
  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBQuest>('Quests');
  const [locallyStoredQuests, setQueststoLocalStorage] = useLocalStorage<
    Quest[]
  >('quests', []);

  const sheetQuestsUpdatedWithLocal: Quest[] = !data
    ? []
    : data
        .map((q) => ({
          id: Number(q.id),
          text: q.Quest,
          completed: false,
          requiresScan: q.requiresScan === 'Yes' || false, // Ensure default values
          scanValue: q.scanValue || '',
        }))
        .map((spreadSheetQuest: Quest) => {
          const localQuest = locallyStoredQuests.find(
            (q) => q.id === spreadSheetQuest.id
          );
          return localQuest
            ? { ...spreadSheetQuest, completed: localQuest.completed }
            : spreadSheetQuest;
        });

  // Function to extract the query parameters
  const getQueryParams = (ref: string) => {
    const params = new URLSearchParams(ref);
    return params.get('key'); // Extracts the 'key' query param (e.g., 'abc')
  };

  useEffect(() => {
    // If there's a questId in the URL, mark the corresponding quest as completed
    if (questId) {
      const questIdNumber = Number(questId);
      console.log('Quest-id from deep link? ', questId);
      const key = getQueryParams(location.search);
      console.log('key: ', key);

      // Function to extract the query parameters

      setQueststoLocalStorage(
        sheetQuestsUpdatedWithLocal.map((quest: Quest) =>
          quest.scanValue &&
          quest.id === questIdNumber &&
          key === getQueryParams(quest.scanValue)
            ? { ...quest, completed: true }
            : quest
        )
      );
    }
  }, [questId, sheetQuestsUpdatedWithLocal, setQueststoLocalStorage]);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimate(null); // Stop the animation after 2-3 seconds
        console.log('animation ended');
      }, 2000); // Duration of the animation

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [animate]);

  const scanBarcode = async (quest: Quest) => {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({ hint: 0 });
      if (result.ScanResult) {
        if (result.ScanResult === quest.scanValue) {
          // Mark as completed
          setQueststoLocalStorage(
            sheetQuestsUpdatedWithLocal.map((q) =>
              q.id === quest.id ? { ...q, completed: true } : q
            )
          );
          // TODO:  Play sound on animation start
          //sound.play();
          setAnimate(quest.id);
        } else {
          alert('Incorrect barcode scanned. Try again.');
        }
      }
    } catch (error) {
      console.error('Barcode scanning failed', error);
    }
  };

  const toggleQuestCompletion = (quest: Quest) => {
    if (quest.requiresScan && !quest.completed) {
      scanBarcode(quest);
    } else {
      if (!quest.completed) {
        setAnimate(quest.id);
        // TODO:  Play sound on animation start
        //sound.play();
      }
      setQueststoLocalStorage(
        sheetQuestsUpdatedWithLocal.map((q) =>
          q.id === quest.id ? { ...q, completed: !q.completed } : q
        )
      );
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from Firestore DB
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
                  <IonItem
                    className={
                      animate === quest.id ? 'animated-item' : 'test-me'
                    }
                    key={quest.id}
                    onClick={
                      quest.requiresScan && !quest.completed
                        ? () => scanBarcode(quest)
                        : () => toggleQuestCompletion(quest)
                    }
                  >
                    <IonLabel> {quest.text}</IonLabel>

                    {quest.requiresScan && !quest.completed && (
                      <IonLabel>
                        <IonIcon icon={qrCodeOutline} />
                      </IonLabel>
                    )}
                    <IonCheckbox
                      slot="end"
                      checked={quest.completed}
                      color="success"
                      disabled={quest.requiresScan && !quest.completed} // Disable checkbox if scan required
                      onIonChange={() => toggleQuestCompletion(quest)}
                    >
                      {' '}
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
