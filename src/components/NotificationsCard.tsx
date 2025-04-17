import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
} from '@ionic/react';
import NotificationToggle from './NotificationToggle';
import useNotificationPermissions from '../hooks/useNotifcationPermissions';

const NotificationsCard: React.FC = () => {
  const { notificationPermission } = useNotificationPermissions();
  if (notificationPermission === 'prompt') {
    return null;
  }
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Notifications Types</IonCardTitle>
      </IonCardHeader>

      {notificationPermission === 'denied' ? (
        <>
          <IonCardContent>
            Go to your device's system settings and enable notifications for
            this app so that you can receive updates.
          </IonCardContent>
        </>
      ) : (
        <>
          <IonCardContent>
            <IonItem>
              <NotificationToggle topic="schedule" />
            </IonItem>
            <IonItem>
              <NotificationToggle topic="scavengerHunt" />
            </IonItem>
            <IonItem>
              <NotificationToggle topic="trickComp" />
            </IonItem>
            <IonItem>
              <NotificationToggle topic="racing" />
            </IonItem>
          </IonCardContent>
        </>
      )}
    </IonCard>
  );
};

export default NotificationsCard;
