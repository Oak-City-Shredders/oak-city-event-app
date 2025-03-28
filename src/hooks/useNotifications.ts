import { useEffect, useState } from 'react';
import {
  PushNotifications,
  PushNotificationSchema,
  Token,
  ActionPerformed,
  PermissionStatus,
  RegistrationError,
} from '@capacitor/push-notifications';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { updateTopicSubscription } from '../utils/notificationUtils';

export const PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY =
  'push_notification_token';

export const NOTIFICATION_SETTINGS_LOCAL_STORAGE_KEY =
  'notificationSettings-v5';

const MAX_PREVIEW_MESSAGES = 3;

export type NotificationSetting = { enabled: boolean; name: string };

const defaultNotificationSettings: Record<string, NotificationSetting> = {
  racing: { enabled: true, name: 'Racing' },
  scavengerHunt: { enabled: true, name: 'Scavenger Hunt' },
  trickComp: { enabled: true, name: 'Trick Comp' },
  schedule: { enabled: true, name: 'Schedule' },
};

interface UseNotificationsReturn {
  pushToken: string | null;
  notifications: PushNotificationSchema[];
  notificationPermission: PermissionState;
  removeNotification: (notification: PushNotificationSchema) => void;
}

const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>(
    []
  );

  // TODO
  const [notificationPermission, setNotificationPermission] =
    useState<PermissionState>('prompt');
  // TODO
  const [pushToken, setPushToken] = useState<string | null>(null);

  const removeNotification = (notification: PushNotificationSchema) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
  };

  const loadNotifications = async () => {
    try {
      const result = await PushNotifications.getDeliveredNotifications();
      // Merge the notifcations delivered in the background with any that
      // have already been received by listeners
      setNotifications((prev) => {
        PushNotifications.removeAllDeliveredNotifications(); // clean up the ones they haven't clicked on
        // remove any duplicates
        const merged = [...result.notifications, ...prev].reduce<
          PushNotificationSchema[]
        >((acc, item) => {
          if (!acc.some((existing) => existing.id === item.id)) {
            acc.push(item);
          }
          return acc;
        }, []);
        return merged.slice(0, MAX_PREVIEW_MESSAGES); //only display 4 max
      });
    } catch (error) {
      console.error('Error fetching delivered notifications', error);
    }
  };

  useEffect(() => {
    if (!Capacitor.isPluginAvailable('PushNotifications')) return;

    // Request permission to use push notifications
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        console.error('Push notification permission denied');
      }
    });

    PushNotifications.addListener('registration', async (token: Token) => {
      loadNotifications();
      const storedToken = localStorage.getItem(
        PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY
      );

      if (storedToken !== token.value) {
        try {
          await updateTopicSubscription('all_users', token.value, true);
          localStorage.setItem(
            PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY,
            token.value
          );
        } catch (error) {
          console.error('Registration Error:', error);
        }
      }

      // Initialize topic subscriptions
      const storedSettings = window.localStorage.getItem(
        NOTIFICATION_SETTINGS_LOCAL_STORAGE_KEY
      );
      let localNotificationSettings: Record<string, NotificationSetting> = {};

      try {
        localNotificationSettings = storedSettings
          ? JSON.parse(storedSettings)
          : {};
      } catch (error) {
        console.error('Failed to parse local notification settings:', error);
      }

      let updatedLocalSettings = false;

      for (const topic of Object.keys(defaultNotificationSettings)) {
        if (!(topic in localNotificationSettings)) {
          if (defaultNotificationSettings[topic].enabled) {
            await updateTopicSubscription(topic, token.value, true);
          }

          localNotificationSettings[topic] = {
            enabled: defaultNotificationSettings[topic].enabled,
            name: defaultNotificationSettings[topic].name,
          };

          updatedLocalSettings = true;
        }
      }

      if (updatedLocalSettings) {
        window.localStorage.setItem(
          NOTIFICATION_SETTINGS_LOCAL_STORAGE_KEY,
          JSON.stringify(localNotificationSettings)
        );
      }
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        setNotifications((prev) =>
          [notification, ...prev].slice(0, MAX_PREVIEW_MESSAGES)
        );
        loadNotifications();
      }
    );

    // Listener for when a notification is tapped
    const notificationTapped = async (actionPerformed: ActionPerformed) => {
      setNotifications((prev) => {
        var r = prev;
        if (!prev.find((n) => n.id === actionPerformed.notification.id)) {
          r.unshift(actionPerformed.notification);
        }
        return r.slice(0, MAX_PREVIEW_MESSAGES);
      });
      //}
    };

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      notificationTapped
    );

    // Fetch delivered notifications when app is resumed
    const appResumed = async () => {
      loadNotifications();
    };
    App.addListener('resume', appResumed);

    return () => {
      PushNotifications.removeAllListeners();
      App.removeAllListeners();
    };
  }, []);

  return {
    pushToken,
    notifications,
    notificationPermission,
    removeNotification,
  };
};

export default useNotifications;
