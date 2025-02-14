import React, { useMemo, useState } from 'react';
import {
  RefresherEventDetail,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonToggle,
  IonItemGroup,
  IonItemDivider,
  IonRefresher,
  IonRefresherContent,
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import useGoogleSheets from '../hooks/useGoogleSheets';
import { getErrorMessage } from '../utils/errorUtils';
import useLocalStorage from '../hooks/useLocalStorage';
import { updateTopicSubscription } from '../utils/notificationUtils';
import { PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY } from '../hooks/useNotifications';
import { Capacitor } from '@capacitor/core';
import PageHeader from '../components/PageHeader';
import { chevronDown, chevronForward } from "ionicons/icons";
import divisions from '../data/RacingDivisions.json';

interface NotificationSettings {
  racingEnabled: boolean;
}

interface Racer {
  name: string;
  team?: string;
}

interface Division {
  id: number;
  name: string;
  description?: string;
  racers: Racer[];
}

const RACING_TOPIC = 'racing';

const Raceing: React.FC = () => {
  const [racingNotificationsError, setRacingNotificationsError] = useState('');
  const [notificationSettings, setNotificationsSettings] =
    useLocalStorage<NotificationSettings>('notificationSettings', {
      racingEnabled: false,
    });

  const SHEET_ID = import.meta.env
    .VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
  const RANGE = 'Sheet1!A:C'; // Adjust range based on racer data (e.g., A:C for 3 columns)

  const {
    data: sheetsData,
    loading,
    error,
    refetch,
  } = useGoogleSheets(SHEET_ID, RANGE);

  const toggleNotification = async () => {
    const storedToken = localStorage.getItem(
      PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY
    );
    if (!storedToken) {
      setRacingNotificationsError(
        'Notifcation settings error. Did you enable notifications?'
      );
      return;
    }

    try {
      await updateTopicSubscription(
        RACING_TOPIC,
        storedToken,
        !notificationSettings.racingEnabled
      );
      setNotificationsSettings((prev) => ({
        ...prev,
        racingEnabled: !prev.racingEnabled,
      }));
      setRacingNotificationsError('');
    } catch (error) {
      console.log('Error updating registration for racing topic');
      setRacingNotificationsError(
        'Error updating registration for racing notifications'
      );
    }
  };

  const groupedDivisions: Division[] | undefined = useMemo(() => {
    if (!sheetsData) return undefined;

    const data: { division: string; racer: Racer }[] = sheetsData
      .slice(1)
      .map(([division, racer, team]: string[]) => ({
        division: division,
        racer: { name: racer, team },
      }));

    const grouped = data.reduce<Record<string, Racer[]>>(
      (acc, { division: division, racer }) => {
        if (!acc[division]) acc[division] = [];
        acc[division].push(racer);
        return acc;
      },
      {}
    );

    return Object.entries(grouped).map(([name, racers], id) => {
      const description = divisions.find(d => d.division === name)?.description || "";
      return {
        id,
        description,
        name,
        racers,
      }
    });
  }, [sheetsData]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from useGoogleSheets
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  const [expandedDivision, setExpandedDivision] = useState<number | null>(null);

  const toggleDivision = (divisionId: number) => {
    setExpandedDivision(expandedDivision === divisionId ? null : divisionId);
  };


  return (
    <IonPage>
      <PageHeader title="Registered Racers" />
      <IonContent fullscreen className="ion-padding">
        {Capacitor.isPluginAvailable('PushNotifications') && (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Racing Notifications</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonToggle
                checked={notificationSettings.racingEnabled}
                onIonChange={() => toggleNotification()}
              >
                Enable race notifications
              </IonToggle>
              {racingNotificationsError && (
                <IonItem>
                  <IonLabel color={'danger'}>
                    {racingNotificationsError}
                  </IonLabel>
                </IonItem>
              )}
            </IonCardContent>
          </IonCard>
        )}

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <IonSpinner name="dots" />
        ) : error ? (
          <IonText color="danger">
            <p>Error loading racing data, please check back later.</p>
            <p>{getErrorMessage(error)}</p>
          </IonText>
        ) : !groupedDivisions || groupedDivisions.length === 0 ? (
          <IonText>No racers are currently available to be shown.</IonText>
        ) : (
          <>



            <IonList>
              {groupedDivisions.map((division) => {
                const isExpanded = expandedDivision === division.id;

                return (
                  <IonItemGroup key={division.id}>
                    <IonItemDivider
                      slot="header"
                      color="secondary"
                      //button
                      onClick={() => toggleDivision(division.id)}
                    >
                      <IonText class="ion-text-nowrap" slot="start">
                        {`${division.name}`}
                      </IonText>
                      <IonIcon
                        icon={isExpanded ? chevronDown : chevronForward}
                        slot="end"
                      />
                    </IonItemDivider>


                    <div slot="content">

                      {isExpanded && (
                        <IonCard>
                          <IonCardContent>
                            <IonText>{division.description}</IonText>
                          </IonCardContent>
                        </IonCard>
                      )}

                      <IonList>
                        {division.racers.map((racer, index) => (
                          <IonItem key={index}>
                            <IonLabel>
                              {racer.name} {racer.team ? `[${racer.team}]` : ""}
                            </IonLabel>
                          </IonItem>
                        ))}
                      </IonList>
                    </div>

                  </IonItemGroup>
                );
              })}
            </IonList>

          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Raceing;
