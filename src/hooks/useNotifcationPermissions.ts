import { useEffect, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { PermissionState } from '@capacitor/core';
import { App } from '@capacitor/app';

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

    // Fetch delivered notifications when app is resumed
    let appResumedListener: { remove: () => void }; // Type for the listener handle
    (async () => {
      const appResumed = async () => {
        try {
          const permissionStatus = await PushNotifications.checkPermissions();
          setNotificationPermission(permissionStatus.receive);
        } catch (error) {
          console.error('Error checking notification permissions:', error);
        }
      };
      appResumedListener = await App.addListener('resume', appResumed);
    })();

    return () => {
      if (appResumedListener) {
        appResumedListener.remove();
      }
      console.log('useNotifications cleanup - all listeners removed');
    };
  }, []);

  const [notificationPermission, setNotificationPermission] =
    useState<PermissionState>('prompt');

  return { notificationPermission };
};

export default useNotificationPermissions;
