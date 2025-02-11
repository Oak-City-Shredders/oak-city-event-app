import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import CardLayout from "../components/CardLayout";
import { useIonRouter } from "@ionic/react";
import { homePageLayout } from "../data/homePageLayout";
import { IonButtons, IonList, IonItem, IonLabel, IonIcon, IonCard, IonButton, IonBadge } from "@ionic/react";
import { personCircleOutline, notificationsOutline, timeOutline, flagOutline, closeOutline } from "ionicons/icons";
import { PushNotificationSchema } from "@capacitor/push-notifications";
import StokeMeter from "../components/StokeMeter"


const iconMap = {
  race: flagOutline, // Racing related
  time: timeOutline, // Time related
};

const getIconForNotification = (notification: PushNotificationSchema) => {
  const text = `${notification.title} ${notification.body}`.toLowerCase();
  for (const key of Object.keys(iconMap) as Array<keyof typeof iconMap>) {
    if (text.includes(key)) return iconMap[key];
  }
  return notificationsOutline; // Default icon
};

interface HomeProps {
  notifications: PushNotificationSchema[];
  removeNotification: (notifcation: PushNotificationSchema) => void;
}

const Home: React.FC<HomeProps> = ({ notifications, removeNotification }) => {

  const router = useIonRouter();

  const handleCardClick = (route: string) => {
    router.push(route, "forward"); // "forward" for a page transition effect
  };

  const handleAuthClick = () => {
    router.push("/login", "forward");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"primary"}>
          <IonTitle>Oak City Shred Fest 5</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleAuthClick}>
              <IonIcon icon={personCircleOutline} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {notifications.length > 0 && (<IonCard className="ion-padding">
          <IonList>
            {notifications.map((notification) => (
              <IonItem key={notification.id}>
                <IonIcon icon={getIconForNotification(notification)} slot="start" />
                <IonLabel>
                  <h2>{notification.title}</h2>
                  <p>{notification.body}</p>
                </IonLabel>
                <IonButton fill="clear" onClick={() => removeNotification(notification)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </IonCard>)}
        <StokeMeter />
        <CardLayout items={homePageLayout} handleCardClick={handleCardClick} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
