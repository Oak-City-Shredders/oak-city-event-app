import { useEffect, useState } from "react";
import {
  PushNotifications,
  PushNotificationSchema,
  PushNotificationToken,
  PushNotificationActionPerformed,
  PermissionStatus,
  RegistrationError,
} from "@capacitor/push-notifications";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

interface UseNotificationsReturn {
  pushToken: string | null;
  notifications: PushNotificationSchema[];
  notificationPermission: PermissionState;
}

const useNotifications = (): UseNotificationsReturn => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<PushNotificationSchema[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<PermissionState>("prompt");

  useEffect(() => {

    if (!Capacitor.isPluginAvailable("PushNotifications")) return;

    // Listener for foreground notifications
    const notificationReceived = (notification: PushNotificationSchema) => {
      console.log("Push received:", notification);
      setNotifications((prev) => [...prev, notification]);
    };
    PushNotifications.addListener("pushNotificationReceived", notificationReceived);

    // Listener for when a notification is tapped
    const notificationTapped = async (notification: PushNotificationActionPerformed) => {
      console.log("Notification tapped:", notification);
      try {
        const delivered = await PushNotifications.getDeliveredNotifications();
        console.log("Delivered notifications after tap:", delivered.notifications);
        setNotifications((prev) => delivered.notifications);
      } catch (error) {
        console.error("Error fetching delivered notifications:", error);
      }
    };
    PushNotifications.addListener("pushNotificationActionPerformed", notificationTapped);

    // Fetch delivered notifications when app is resumed
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

    const registerNotifications = async () => {
      try {
        // Request permission
        const permStatus: PermissionStatus = await PushNotifications.requestPermissions();
        setNotificationPermission(permStatus.receive as PermissionState);
        console.log("Push Notification permission status:", permStatus);

        if (permStatus.receive !== "granted") {
          console.log("Push Notification permission not granted!");
          return;
        }

        // Listener for successful registration
        const registrationSuccess = (token: PushNotificationToken) => {
          console.log("Push registration success, token:", token.value);
          setPushToken(token.value);
        };
        PushNotifications.addListener("registration", registrationSuccess);

        // Listener for registration errors
        const registrationError = (error: RegistrationError) => {
          console.error("Push registration error:", error);
        };
        PushNotifications.addListener("registrationError", registrationError);

        // Register for push notifications
        await PushNotifications.register();

        try {
          const delivered = await PushNotifications.getDeliveredNotifications();
          console.log("Delivered notifications:", delivered.notifications);
          setNotifications(delivered.notifications);
        } catch (error) {
          console.error("Error fetching initial delivered notifications:", error);
        }
      } catch (error) {
        console.error("Push Notification setup failed:", error);
      }
    };

    registerNotifications();

    return () => {
      PushNotifications.removeAllListeners();
      App.removeAllListeners();
    };
  }, []);

  return { pushToken, notifications, notificationPermission };
};

export default useNotifications;
