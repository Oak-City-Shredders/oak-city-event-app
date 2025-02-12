import React, { useMemo, useState } from "react";
import { RefresherEventDetail, IonCardHeader, IonCard, IonCardContent, IonCardSubtitle, IonToggle, IonItemGroup, IonItemDivider, IonRefresher, IonRefresherContent, IonHeader, IonToolbar, IonPage, IonContent, IonList, IonItem, IonLabel, IonText, IonSpinner, IonTitle } from "@ionic/react";
import useGoogleSheets from "../hooks/useGoogleSheets";
import { getErrorMessage } from "../utils/errorUtils";
import useLocalStorage from "../hooks/useLocalStorage"
import { updateTopicSubscription } from "../utils/notificationUtils";
import { PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY } from "../hooks/useNotifications";
import { Capacitor } from "@capacitor/core";

interface NotificationSettings {
  racingEnabled: boolean;
}

interface Racer {
  name: string;
  team?: string;
}

interface Category {
  id: number;
  name: string;
  racers: Racer[];
}

const RACING_TOPIC = "racing";

const Raceing: React.FC = () => {

  const [racingNotificationsError, setRacingNotificationsError] = useState("");
  const [notificationSettings, setNotificationsSettings] = useLocalStorage<NotificationSettings>("notificationSettings", { racingEnabled: false });

  const SHEET_ID = import.meta.env.VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
  const RANGE = "Sheet1!A:C"; // Adjust range based on racer data (e.g., A:C for 3 columns)

  const { data: sheetsData, loading, error, refetch } = useGoogleSheets(SHEET_ID, RANGE);

  const toggleNotification = async () => {
    const storedToken = localStorage.getItem(PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY);
    if (!storedToken) {
      setRacingNotificationsError("Notifcation settings error. Did you enable notifications?");
      return;
    }

    try {
      await updateTopicSubscription(RACING_TOPIC, storedToken, !notificationSettings.racingEnabled);
      setNotificationsSettings(prev => ({
        ...prev,
        racingEnabled: !prev.racingEnabled
      }));
      setRacingNotificationsError("");
    } catch (error) {
      console.log("Error updating registration for racing topic");
      setRacingNotificationsError("Error updating registration for racing notifications");
    }
  }

  const groupedCategories: Category[] | undefined = useMemo(() => {
    if (!sheetsData) return undefined;

    const data: { category: string; racer: Racer }[] = sheetsData.slice(1).map(([category, racer, team]: string[]) => ({
      category,
      racer: { name: racer, team },
    }));

    const grouped = data.reduce<Record<string, Racer[]>>((acc, { category, racer }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(racer);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, racers], id) => ({
      id,
      name,
      racers,
    }));
  }, [sheetsData]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from useGoogleSheets
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registered Racers</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {(Capacitor.isPluginAvailable("PushNotifications")) && (
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
              <IonLabel color={"danger"}>{racingNotificationsError}</IonLabel>
            </IonItem>)}
          </IonCardContent>
        </IonCard>)}

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
        ) : !groupedCategories || groupedCategories.length === 0 ? (
          <IonText>No racers are currently available to be shown.</IonText>
        ) : (<>
          <IonList>
            {groupedCategories.map((category) => (
              <IonItemGroup defaultChecked={true} key={category.id} >
                <IonItemDivider slot="header" color="secondary">
                  <IonText class={"ion-text-nowrap"} slot="start">{`${category.name}`}</IonText>
                  <IonText slot="end">{`(${category.racers.length})`}</IonText>
                </IonItemDivider>
                <div slot="content">
                  <IonList>
                    {category.racers.map((racer, index) => (
                      <IonItem key={index}>
                        <IonLabel>{racer.name} {racer.team ? `[${racer.team}]` : ""}</IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
                </div>
              </IonItemGroup>))}
          </IonList></>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Raceing;
