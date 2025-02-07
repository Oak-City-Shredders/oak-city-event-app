import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from "@ionic/react";
import { PushNotificationSchema } from "@capacitor/push-notifications";

interface NotificationsPageProps {
  notifications: PushNotificationSchema[];
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
       
        {notifications.length > 0 ? (
          <IonList>
            {notifications.map((notification) => (
              <IonItem key={notification.id}>
                <IonLabel>
                  <strong>{notification.title}</strong>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <p>No notifications</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NotificationsPage;
