import { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { IonToggle, IonItem, IonLabel } from '@ionic/react';
import {
  NOTIFICATION_SETTINGS_LOCAL_STORAGE_KEY,
  NotificationSetting,
  PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY,
} from '../hooks/useNotifications';
import { updateTopicSubscription } from '../utils/notificationUtils';
import { Capacitor } from '@capacitor/core';

const NotificationToggle: React.FC<{ topic: string }> = ({ topic }) => {
  if (!Capacitor.isNativePlatform()) {
    return <></>;
  }

  const [notificationSettings, setNotificationsSettings] = useLocalStorage<
    | {
        [key: string]: NotificationSetting;
      }
    | undefined
  >(NOTIFICATION_SETTINGS_LOCAL_STORAGE_KEY, undefined);

  if (!notificationSettings) {
    console.error(
      'notificationSettings were not properly initialized in useNotification.ts'
    );
    return;
  }

  const [notificationsError, setNotificationsError] = useState('');

  const toggleNotification = async () => {
    const storedToken = localStorage.getItem(
      PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY
    );
    if (!storedToken) {
      setNotificationsError(
        'Notifcation settings error. Did you enable notifications?'
      );
      return <></>;
    }
    if (!notificationSettings) return;
    try {
      await updateTopicSubscription(
        topic,
        storedToken,
        !notificationSettings[topic].enabled
      );
      setNotificationsSettings((prev) => {
        notificationSettings[topic].enabled =
          !notificationSettings[topic].enabled;
        return notificationSettings;
      });
      setNotificationsError('');
    } catch (error) {
      console.log(`Error updating registration for ${topic} topic`);
      setNotificationsError(
        `Error updating registration for ${topic} notifications`
      );
    }
  };

  return (
    <>
      <IonToggle
        checked={notificationSettings[topic].enabled}
        onIonChange={() => toggleNotification()}
      >
        {notificationSettings[topic].name}
      </IonToggle>
      {notificationsError && (
        <IonItem>
          <IonLabel color={'danger'}>{notificationsError}</IonLabel>
        </IonItem>
      )}
    </>
  );
};

export default NotificationToggle;
