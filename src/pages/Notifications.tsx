import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from "@ionic/react";
import { PushNotificationSchema } from "@capacitor/push-notifications";
import useGoogleSheets from "../hooks/useGoogleSheets";
import { useMemo } from "react";

interface NotificationsPageProps {
  notifications: PushNotificationSchema[];
}

interface SheetNotification {
  title: string;
  message: string;
  topic: string;
  published: string;
  result: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications }) => {

  const SHEET_ID = import.meta.env.VITE_REACT_APP_GOOGLE_SHEET_NOTIFICATION_ID as string;
  const RANGE = "Notifications!A:E"; // Adjust range based on racer data (e.g., A:C for 3 columns)

  const { data: sheetsData, loading, error } = useGoogleSheets(SHEET_ID, RANGE);

  const sheetNotifications: SheetNotification[] = useMemo(() => {
    if (!sheetsData) return [];

    return sheetsData.slice(1) // Skip header row
      .map(([title, message, topic, published, result]: string[]) => ({
        title,
        message,
        topic,
        published,
        result,
      }))
      .filter((notification) => notification.published === "Publish")
      .reverse();; // Only keep published rows
  }, [sheetsData]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {loading ? (
          <p>Loading notifications...</p>
        ) : error ? (
          <p>Error loading notifications</p>
        ) : sheetNotifications.length > 0 ? (
          <IonList>
            {sheetNotifications.map((notification, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <p>No notifications</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NotificationsPage;