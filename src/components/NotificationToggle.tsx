import { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonToggle,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
} from '@ionic/react';
import useNotificationPermissions from '../hooks/useNotifcationPermissions';
import { notificationsOffOutline } from 'ionicons/icons';
import {
  NOTIFICATION_SETTINGS_LOCAL_STORAGE_KEY,
  NotificationSetting,
  PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY,
} from '../hooks/useNotifications';
import { updateTopicSubscription } from '../utils/notificationUtils';

const NotificationToggle: React.FC<{ topic: string }> = ({ topic }) => {
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

  const { notificationPermission } = useNotificationPermissions();
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
      {notificationPermission === 'prompt' ? (
        ''
      ) : notificationPermission === 'denied' ? (
        <IonCard>
          <IonCardContent>
            <IonIcon icon={notificationsOffOutline} /> Go to your device's
            system settings and enable notifications for this app so that you
            can receive updates.
          </IonCardContent>
        </IonCard>
      ) : (
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Enable Notifications?</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonToggle
              checked={notificationSettings[topic].enabled}
              onIonChange={() => toggleNotification()}
            >
              {notificationSettings[topic].name} notifications
            </IonToggle>
            {notificationsError && (
              <IonItem>
                <IonLabel color={'danger'}>{notificationsError}</IonLabel>
              </IonItem>
            )}
          </IonCardContent>
        </IonCard>
      )}
    </>
  );
};

export default NotificationToggle;
