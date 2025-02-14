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
} from '@ionic/react';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import useGoogleSheets from '../hooks/useGoogleSheets';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PageHeader from '../components/PageHeader';

interface NotificationsPageProps {
  notifications: PushNotificationSchema[];
}

interface SheetNotification {
  title: string;
  message: string;
  topic: string;
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
  const SHEET_ID = '1I1pyZteIDs-M22DrVc5vmqvii-olGAlFlG78UpN--KI';
  const RANGE = 'Notifications!A:G'; // Adjust range based on racer data (e.g., A:C for 3 columns)

  const {
    data: sheetsData,
    loading,
    error,
    refetch,
  } = useGoogleSheets(SHEET_ID, RANGE);

  const sheetNotifications: SheetNotification[] = useMemo(() => {
    if (!sheetsData) return [];

    return sheetsData
      .slice(1) // Skip header row
      .map(([title, message, topic, published, date, result, details]: string[]) => ({
        title,
        message,
        topic,
        details,
        published,
        date,
        result,
      }))
      .filter(
        (notification) =>
          notification.published === 'Publish' &&
          notification.result === 'Success'
      )
      .reverse(); // Only keep published rows
  }, [sheetsData]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from useGoogleSheets
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
          </IonList>
        ) : (
          <p>No notifications</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NotificationsPage;
