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
import { Quest } from '../components/QuestItem';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import './Quests.css';
import { useRefreshHandler } from '../hooks/useRefreshHandler';
import { logEvent } from '../utils/analytics';
import { checkVibrate } from '../utils/vibrate';
import ReactConfetti from 'react-confetti';

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
        })
        .sort((a, b) => a.id - b.id);

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
          checkVibrate(
            async () => await Haptics.impact({ style: ImpactStyle.Heavy })
          );

          setAnimate(quest.id);
        } else {
          alert('Incorrect barcode scanned. Try again.');
        }
      }
    } catch (error) {
      console.error('Barcode scanning failed', error);
    }
  };

  const toggleQuestCompletion = async (quest: Quest) => {
    if (quest.requiresScan && !quest.completed) {
      scanBarcode(quest);
    } else {
      if (!quest.completed) {
        logEvent('completed quest', { quest: quest.text });
        checkVibrate(
          async () => await Haptics.impact({ style: ImpactStyle.Medium })
        );
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

  const handleRefresh = useRefreshHandler(refetch);

  return (
    <IonPage>
      <PageHeader title="Side Quests" />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <IonCard>
          {sheetQuestsUpdatedWithLocal.every((quest) => quest.completed) && (
            <ReactConfetti />
          )}
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
            <IonCardHeader style={{ padding: '0 12px 16px 12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <IonCardTitle>Side Quests</IonCardTitle>
                <div>
                  <IonText color="medium">
                    {
                      sheetQuestsUpdatedWithLocal.filter(
                        (quest) => quest.completed
                      ).length
                    }{' '}
                    of {sheetQuestsUpdatedWithLocal.length}
                  </IonText>
                </div>
              </div>
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
