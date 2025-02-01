import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

function useDeliveredNotifications() {
  const [deliveredNotifications, setNotificationList] = useState([]);

  // Check if the app was launched via a notification and handle it
  useEffect(() => {
    async function checkInitialNotification() {
      if (Capacitor.isPluginAvailable("PushNotifications")) {
        const notificationsList = await PushNotifications.getDeliveredNotifications();
        if (notificationsList.notifications.length > 0) {
            console.log("App launched via notification:", notificationsList.notifications[0]);
            setNotificationList(notificationsList.notifications);
        }
      }
    }
    checkInitialNotification();
  }, []);

  return { deliveredNotifications };
}

export default useDeliveredNotifications;
