import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

function useNotifications() {
  const nullEntry = [];
  const [notifications, setNotifications] = useState(nullEntry);

  useEffect(() => {

    // Register once when the app initializes
    if (Capacitor.isPluginAvailable("PushNotifications")) {
      PushNotifications.checkPermissions().then((res) => {
        if (res.receive !== "granted") {
          PushNotifications.requestPermissions().then((res) => {
            if (res.receive === "denied") {
              console.log("Push Notification permission denied");
            } else {
              console.log("Push Notification permission granted");
              register();
            }
          });
        } else {
          register();
        }
      });
    }

    const register = () => {
      console.log("Initializing Notifications");

      // Check if the token exists in localStorage
      const savedToken = localStorage.getItem('push_token');
      if (!savedToken) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

        // On success, we should be able to receive notifications
        PushNotifications.addListener("registration", (token) => {
          console.log("Push registration success (token):" + token.value);
           // Store the token in localStorage
          localStorage.setItem('push_token', token.value);
        });

        // Some issue with our setup and push will not work
        PushNotifications.addListener("registrationError", (error) => {
          alert("Error on registration: " + JSON.stringify(error));
          console.log("Error on registration: " + JSON.stringify(error));
        });
      } else {
        console.log('Using saved push token:', savedToken);
      }
    };

    // Listener for notifications when app is in the foreground
    const handlePushNotificationReceived = (notification) => {
      console.log("Push received: " + JSON.stringify(notification));
      setNotifications((notifications) => [
        ...notifications,
        {
          id: notification.id,
          title: notification.title,
          body: notification.body,
          type: "foreground",
        },
      ]);
    };

    // Listener for actions performed on notifications
    const handlePushNotificationActionPerformed = (notification) => {
      console.log("Push notification action performed: " + JSON.stringify(notification));
      setNotifications((notifications) => [
        ...notifications,
        {
          id: notification.notification.data.id,
          title: notification.notification.data.title,
          body: notification.notification.data.body,
          type: "action",
        },
      ]);
    };

    // Add listeners on mount
    if (Capacitor.isPluginAvailable("PushNotifications")) {
      PushNotifications.addListener(
        "pushNotificationReceived",
        handlePushNotificationReceived
      );
      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        handlePushNotificationActionPerformed
      );
    }

    // Clean up listeners on unmount
    return () => {
      if (Capacitor.isPluginAvailable("PushNotifications")) {
        PushNotifications.removeListener(
          "pushNotificationReceived",
          handlePushNotificationReceived
        );
        PushNotifications.removeListener(
          "pushNotificationActionPerformed",
          handlePushNotificationActionPerformed
        );
      }
    };
  }, []);

  return { notifications };
}

export default useNotifications;
