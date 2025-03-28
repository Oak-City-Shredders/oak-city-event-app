import React from 'react';
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
} from '@ionic/react';
import { alarm, calendar, home, map } from 'ionicons/icons';

interface AppTabBarProps {
  notifications: any[];
}

const AppTabBar: React.FC<AppTabBarProps> = ({ notifications }) => {
  return (
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/home">
        <IonIcon aria-hidden="true" icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="map" href="/map">
        <IonIcon aria-hidden="true" icon={map} />
        <IonLabel>Map</IonLabel>
      </IonTabButton>
      <IonTabButton tab="schedule" href="/schedule">
        <IonIcon aria-hidden="true" icon={calendar} />
        <IonLabel>Schedule</IonLabel>
      </IonTabButton>
      <IonTabButton tab="notifcations" href="/notifications">
        <IonIcon icon={alarm} />
        {notifications.length > 0 && (
          <IonBadge color="danger">{notifications.length}</IonBadge>
        )}
        <IonLabel>Notifications</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default AppTabBar;
