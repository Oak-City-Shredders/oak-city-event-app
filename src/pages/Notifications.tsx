import React from 'react';
import {
  RefresherEventDetail,
  IonRefresher,
  IonRefresherContent,
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PageHeader from '../components/PageHeader';
import useNotificationPermissions from '../hooks/useNotifcationPermissions';

interface NotificationsPageProps {
  notifications: PushNotificationSchema[];
}

interface FireDBNotification {
  "Date Sent": string;
  "Details": string;
  "Message": string;
  "Publish State": string;
  "Result": string;
  "Schedule": string;
  "Title": string;
  "Topic": string;
  id: string;
}


interface SheetNotification {
  title: string;
  message: string;
  topic: string;
  scheduled: string
  details: string;
  published: string;
  date: string;
  result: string;
}

dayjs.extend(relativeTime);

const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
}) => {
  dayjs.extend(relativeTime);

  const {
    data: sheetsData,
    loading,
    error,
    refetch,
  } = useFireStoreDB<FireDBNotification>("notifications");


  const sheetNotifications: SheetNotification[] = useMemo(() => {
    if (!sheetsData) return [];

    const mappedData = sheetsData
      .map((d: FireDBNotification) => ({
        title: d.Title,
        message: d.Message,
        topic: d.Topic,
        scheduled: d.Schedule,
        details: d.Details,
        published: d['Publish State'],
        date: d['Date Sent'],
        result: d.Result,
      }))

    const filteredData = mappedData
      .filter(
        (notification) =>
          notification.published === 'Publish' && // Only keep published rows
          notification.result === 'Success'
      )
      .reverse();

    return filteredData;
  }, [sheetsData]);

  const { notificationPermission } = useNotificationPermissions();

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from Firestore DB
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  return (
    <IonPage>
      <PageHeader title="Notifications" />
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {loading ? (
          <p>Loading notifications...</p>
        ) : error ? (
          <p>Error loading notifications</p>
        ) : sheetNotifications.length > 0 ? (
          <>
            {notificationPermission === 'denied' && (
              <IonCard><IonCardContent>
                You have not granted permission to receive push notifications. Please enable them in your device settings.
              </IonCardContent></IonCard>)}
            <IonList>
              {sheetNotifications.map((notification, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    <p>{dayjs().to(notification.date)}</p>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    {notification.details && <i>{notification.details}</i>}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList></>
        ) : (
          <p>No notifications</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NotificationsPage;
