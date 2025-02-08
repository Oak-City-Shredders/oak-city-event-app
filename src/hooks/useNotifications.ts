import { useEffect, useState } from "react";
import {
  PushNotifications,
  PushNotificationSchema,
  Token,
  ActionPerformed,
  PermissionStatus,
  RegistrationError,
} from "@capacitor/push-notifications";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { CapacitorHttp } from '@capacitor/core';
import type { HttpResponse } from '@capacitor/core';

const API_URL = "https://register-push-notification-604117514059.us-central1.run.app";
const TOPIC = "all_users";
const LOCAL_STORAGE_KEY = "push_notification_token";

interface UseNotificationsReturn {
 pushToken: string | null;
 notifications: PushNotificationSchema[];
 notificationPermission: PermissionState;
 removeNotification: (notification: PushNotificationSchema) => void;
}

const useNotifications = (): UseNotificationsReturn => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<PermissionState>("prompt");

  const removeNotification = (notification: PushNotificationSchema) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
  }

  useEffect(() => {
    if (!Capacitor.isPluginAvailable("PushNotifications")) return;

    // Request permission to use push notifications
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        console.error('Push notification permission denied');
      }
    });

    PushNotifications.addListener('registration', async (token: Token) => {
      

      console.log('Push registration success, token: ' + token.value);


      const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedToken !== token.value) {
        console.log("New token detected, sending to server...");
        console.log("fetching:", API_URL); 
        const topic = TOPIC;       
        await registerTopic(topic, token);
        //await registerTopic("dev", token);
        
      } else {
        console.log("Token unchanged, no need to update server.");
     }

      async function registerTopic(topic: string, token: Token) {
        try {
          const options = {
            url: API_URL,
            headers: { 'Content-Type': 'application/json' },
            data: { token: token.value, topic },
          };

          const response: HttpResponse = await CapacitorHttp.post(options);
          console.log('Response:', response);

          if (!response.status || response.status < 200 || response.status >= 300) {
            throw new Error(`Failed to register token. Status: ${response.status}`);
          }
          console.log("Token registered successfully:", token);
          localStorage.setItem(LOCAL_STORAGE_KEY, token.value);

        } catch (error) {
          console.error("Error:", error);
        }
      }
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        setNotifications((prev) => [notification, ...prev].slice(0, 3));
      }
    );
    
    // Listener for when a notification is tapped
    const notificationTapped = async (actionPerformed: ActionPerformed) => {
      console.log("Notification tapped:", actionPerformed);
      // TODO: Navigate to notifications page?
    };
    PushNotifications.addListener("pushNotificationActionPerformed", notificationTapped);

    // Fetch delivered notifications when app is resumed
    /*
    const appResumed = async () => {
      console.log("App resumed - fetching delivered notifications.");
      try {
        const delivered = await PushNotifications.getDeliveredNotifications();
        console.log("Delivered notifications:", delivered.notifications);
        setNotifications(delivered.notifications);
      } catch (error) {
        console.error("Error fetching delivered notifications on resume:", error);
      }
    };
    App.addListener("resume", appResumed);
    */
    
    // This isn't used but could be used in the future to access notfications the user has not clicked on
    // Possibly use this to highlight the most recent notification in the UI
    /*
      try {
        const delivered = await PushNotifications.getDeliveredNotifications();
        console.log("Delivered notifications:", delivered.notifications);
        setNotifications(delivered.notifications);
      } catch (error) {
        console.error("Error fetching initial delivered notifications:", error);
      }
    */

    return () => {
      PushNotifications.removeAllListeners();
      App.removeAllListeners();
      console.log("useNotifications cleanup - all listeners removed");
    };
  }, []);

  return { 
    pushToken, notifications, notificationPermission, removeNotification 
   };
};

export default useNotifications;
