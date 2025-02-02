import { useEffect, useState } from "react";
import { PushNotifications } from "@capacitor/push-notifications";
import { App } from "@capacitor/app";

const useNotifications = () => {
  const [pushToken, setPushToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState("unknown");


  useEffect(() => {

    // Listener for foreground notifications
    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("Push received:", notification);
      setNotifications((prev) => [...prev, notification]);
    });

    // Listener for when a notification is tapped
    PushNotifications.addListener("pushNotificationActionPerformed", async (notification) => {
      console.log("Notification tapped:", notification);
      const delivered = await PushNotifications.getDeliveredNotifications();
      console.log("Delivered notifications after tap:", delivered.notifications);
      setNotifications(delivered.notifications);
    });

    // Fetch delivered notifications when app is resumed
    App.addListener("resume", async () => {
      console.log("App resumed - fetching delivered notifications.");
      const delivered = await PushNotifications.getDeliveredNotifications();
      console.log("Delivered notifications:", delivered.notifications);
      setNotifications(delivered.notifications);
      //await PushNotifications.clearAllDeliveredNotifications();
    });

    const registerNotifications = async () => {
      try {
        // Request permission
        const permStatus = await PushNotifications.requestPermissions();
        setNotificationPermission(permStatus.receive);
        console.log("Push Notification permission status:", permStatus);

        if (permStatus.receive !== "granted") {
          console.log("Push Notification permission not granted!");
          return;
        }

        // Listener for successful registration
        await PushNotifications.addListener("registration", (token) => {
          console.log("Push registration success, token:", token.value);
          setPushToken(token.value);
        });

        // Listener for registration errors
        await PushNotifications.addListener("registrationError", (error) => {
          console.error("Push registration error:", error);
        });

        // Register for push notifications
        await PushNotifications.register();

        const delivered = await PushNotifications.getDeliveredNotifications();
        console.log("Delivered notifications:", delivered.notifications);
        setNotifications(delivered.notifications);

        

      } catch (error) {
        console.error("Push Notification setup failed:", error);
      }
    };

    registerNotifications();

    return () => {
      //PushNotifications.removeAllListeners();
    };
  }, []);

  return { pushToken, notifications, notificationPermission };
};

export default useNotifications;
