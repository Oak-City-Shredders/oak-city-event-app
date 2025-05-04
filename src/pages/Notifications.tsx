import React from 'react';
import {
  IonRefresher,
  IonRefresherContent,
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonIcon,
  IonCardSubtitle,
} from '@ionic/react';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PageHeader from '../components/PageHeader';
import useNotificationPermissions from '../hooks/useNotifcationPermissions';
import { useRefreshHandler } from '../hooks/useRefreshHandler';
import { notificationsOff } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';

interface NotificationsPageProps {
  notifications: PushNotificationSchema[];
}

interface FireDBNotification {
  'Date Sent': string;
  Details: string;
  Message: string;
  'Publish State': string;
  Result: string;
  Schedule: string;
  Title: string;
  Topic: string;
  id: string;
}

interface SheetNotification {
  title: string;
  message: string;
  topic: string;
  scheduled: string;
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
  } = useFireStoreDB<FireDBNotification>('notifications');

  const sheetNotifications: SheetNotification[] = useMemo(() => {
    if (!sheetsData) return [];

    const mappedData = sheetsData.map((d: FireDBNotification) => ({
      title: d.Title,
      message: d.Message,
      topic: d.Topic,
      scheduled: d.Schedule,
      details: d.Details,
      published: d['Publish State'],
      date: d['Date Sent'],
      result: d.Result,
    }));

    const filteredData = mappedData
      .filter(
        (notification) =>
          notification.published === 'Publish' && // Only keep published rows
          notification.result === 'Success'
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort newest to oldest

    return filteredData;
  }, [sheetsData]);

  const { notificationPermission } = useNotificationPermissions();

  const handleRefresh = useRefreshHandler(refetch);

  const checkAndOpenSettings = async () => {
    try {
      await NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      });
      console.log('Opened app settings to enable notifications');
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  };

  return (
    <IonPage>
      <PageHeader title="Notifications" />
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {/* active notifications */}
        {notificationPermission !== 'granted' &&
          Capacitor.isNativePlatform() && (
            <IonCard className="ion-padding">
              <IonCardSubtitle>Notifications Disabled</IonCardSubtitle>
              <IonList lines={'none'}>
                <IonItem onClick={() => checkAndOpenSettings()}>
                  <IonIcon
                    aria-hidden="true"
                    icon={notificationsOff}
                    slot="start"
                  />
                  <IonLabel>
                    You have notifications disabled. Click here to open your
                    system settings and enable notifications.
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCard>
          )}
        {loading ? (
          <p>Loading notifications...</p>
        ) : error ? (
          <p>Error loading notifications</p>
        ) : sheetNotifications.length > 0 ? (
          <>
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
          </>
        ) : (
          <p>No notifications</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NotificationsPage;
