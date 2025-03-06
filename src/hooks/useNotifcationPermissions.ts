import { useEffect, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { PermissionState } from '@capacitor/core';

interface UseNotificationPermissionsReturn {
  notificationPermission: PermissionState;
}

const useNotificationPermissions = (): UseNotificationPermissionsReturn => {
  useEffect(() => {
    if (!Capacitor.isPluginAvailable('PushNotifications')) return;
    const checkPushNotificationsPermissions = async () => {
      // Request permission to use push notifications
      const permissions = await PushNotifications.checkPermissions();
      setNotificationPermission(permissions.receive);
      if (permissions.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
      } else {
        console.error('Push notification permission denied');
      }
    };
    checkPushNotificationsPermissions();
  }, []);

  // TODO
  const [notificationPermission, setNotificationPermission] =
    useState<PermissionState>('prompt');

  return { notificationPermission };
};

export default useNotificationPermissions;
