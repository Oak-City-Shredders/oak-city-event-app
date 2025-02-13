import "./Home.css";
import CardLayout from "../components/CardLayout";
import { homePageLayout } from "../data/homePageLayout";
import {
  IonContent,
  IonHeader,
  IonImg,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import {
  personCircleOutline,
  notificationsOutline,
  timeOutline,
  flagOutline,
  closeOutline,
} from "ionicons/icons";
import { PushNotificationSchema } from "@capacitor/push-notifications";
import StokeMeter from "../components/StokeMeter";

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
    router.push("/login", "root");
  };

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Navigation</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {homePageLayout.map((item, index) => (
              <IonItem
                button
                key={index}
                onClick={() => {
                  handleCardClick(item.route);
                  document.querySelector("ion-menu")?.close();
                }}
              >
                <IonLabel>{item.title}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader translucent={true}>
          <IonToolbar color={"primary"}>
            <IonTitle style={{ "text-align": "center" }}>
              Oak City Shred Fest 5
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleAuthClick}>
                <IonIcon icon={personCircleOutline} size="large" />
              </IonButton>
            </IonButtons>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonImg
                src="/images/OCSF5+Web+Logo.webp"
                alt="Under Construction"
              />
            </IonToolbar>
          </IonHeader>
          {notifications.length > 0 && (
            <IonCard className="ion-padding">
              <IonList>
                {notifications.map((notification) => (
                  <IonItem key={notification.id}>
                    <IonIcon
                      icon={getIconForNotification(notification)}
                      slot="start"
                    />
                    <IonLabel>
                      <h2>{notification.title}</h2>
                      <p>{notification.body}</p>
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      onClick={() => removeNotification(notification)}
                    >
                      <IonIcon icon={closeOutline} />
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            </IonCard>
          )}
          <StokeMeter />
          <CardLayout
            items={homePageLayout}
            handleCardClick={handleCardClick}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
