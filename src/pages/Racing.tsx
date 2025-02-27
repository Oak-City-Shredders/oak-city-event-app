import React, { useMemo, useState, useEffect } from 'react';
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
  IonButton
} from '@ionic/react';
import useGoogleSheets from '../hooks/useGoogleSheets';
import { getErrorMessage } from '../utils/errorUtils';
import useLocalStorage from '../hooks/useLocalStorage';
import { updateTopicSubscription } from '../utils/notificationUtils';
import { PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY } from '../hooks/useNotifications';
import PageHeader from '../components/PageHeader';
import { informationCircle, informationCircleOutline } from "ionicons/icons";
import divisions from '../data/RacingDivisions.json';
import useNotificationPermissions from '../hooks/useNotifcationPermissions';
import { notificationsOffOutline } from 'ionicons/icons';
import { chevronDown, chevronForward } from 'ionicons/icons';

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
  descriptionExpanded?: boolean;
  descriptionTextExpanded?: boolean;
  racers: Racer[];
}

const RACING_TOPIC = 'racing';

const Raceing: React.FC = () => {
  const [racingNotificationsError, setRacingNotificationsError] = useState('');
  const [notificationSettings, setNotificationsSettings] =
    useLocalStorage<NotificationSettings>('notificationSettings', {
      racingEnabled: false,
    });
  const { notificationPermission } = useNotificationPermissions();

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

  const memorizedGroupedDivisions: Division[] = useMemo(() => {
    if (!sheetsData) return [];

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
        descriptionExpanded: true,
        descriptionTextExpanded: false,
      }
    });
  }, [sheetsData]);

  useEffect(() => {
    if (memorizedGroupedDivisions.length > 0) {
      setGroupDivisions(memorizedGroupedDivisions);
    }
  }, [memorizedGroupedDivisions]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from useGoogleSheets
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  const [groupedDivisions, setGroupDivisions] = useState<Division[]>([]);

  const toggleDivision = (divisionId: number) => {
    setGroupDivisions(prev => prev.map(d =>
      d.id === divisionId ? { ...d, descriptionExpanded: !d.descriptionExpanded } : d));
  };

  const onClickDivisionText = (division: Division) => {
    setGroupDivisions(prev => prev.map(d =>
      d.id === division.id ? { ...d, descriptionTextExpanded: !d.descriptionTextExpanded } : d));
  }

  return (
    <IonPage>
      <PageHeader title="Registered Racers" />
      <IonContent fullscreen className="ion-padding">
        {notificationPermission === 'prompt' ? "" : notificationPermission === 'denied' ? (
          <IonCard><IonCardContent>
            <IonIcon icon={notificationsOffOutline} /> Go to your device's system settings and enable notifications for this app so that you can receive updates about racing.
          </IonCardContent></IonCard>)
          :
          (
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

        <IonCard>
          <img src="/images/race2.webp" alt="Luke Austin" style={{ width: "100%", height: "auto", maxHeight: "300px", objectFit: "cover" }} />
          <IonCardContent>
            <IonText>The following people have purchased race tickets for Oak City Shred Fest 5.  Want to race against them?&nbsp;</IonText>
            <IonText>

              <a
                href={"https://www.oakcityshredfest.com/2025-tickets/p/ultimate-racer-bundle"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ whiteSpace: "nowrap" }}
              >
                Get your ticket here
              </a>
            </IonText>
          </IonCardContent>
        </IonCard>

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

                const wordLimit = 20; // Adjust as needed
                const words = division.description?.split(" ") ?? [];

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
                      <IonText >{`(${division.racers.length})`}</IonText> <IonIcon
                        icon={division.descriptionExpanded ? informationCircle : informationCircleOutline}
                        slot="end"
                      />
                    </IonItemDivider>


                    <div slot="content">

                      {division.descriptionExpanded && (
                        <IonCard>
                          <IonCardContent>
                            <IonText>
                              {division.descriptionTextExpanded ? division.description : words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "")}
                            </IonText>
                            {(words.length > wordLimit) && (
                              <IonIcon
                                onClick={() => onClickDivisionText(division)}
                                slot="end"
                                icon={division.descriptionTextExpanded ? chevronDown : chevronForward}
                              />
                            )}
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
