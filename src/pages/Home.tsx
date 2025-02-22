import './Home.css';
import CardLayout from '../components/CardLayout';
import { homePageLayout } from '../data/homePageLayout';
import {
  IonContent,
  IonHeader,
  IonImg,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
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
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';
import {
  personCircleOutline,
  notificationsOutline,
  timeOutline,
  flagOutline,
  closeOutline,
} from 'ionicons/icons';
import { PushNotificationSchema } from '@capacitor/push-notifications';
import StokeMeter from '../components/StokeMeter';
import DynamicContent, {
  DynamicContentProps,
} from '../components/DynamicContent';
import useGoogleSheets from '../hooks/useGoogleSheets';
import CountdownTimer from '../components/CountdownTimer';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { Capacitor } from '@capacitor/core';

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

  const SHEET_ID = import.meta.env
    .VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
  const RANGE = 'DynamicContent!A:J';

  const { data, loading, error, refetch } = useGoogleSheets(SHEET_ID, RANGE);

  const dynamicContent: DynamicContentProps[] = !data
    ? []
    : data
        .slice(1) // Skip header row
        .map(
          ([
            enabled,
            imageLink,
            title,
            subtitle,
            datePosted,
            shortDescription,
            detailedImageLink,
            detailedDescription,
            buttonName,
            buttonLink,
          ]: string[]) => ({
            enabled: enabled === 'Yes',
            imageLink,
            title,
            subtitle,
            datePosted,
            shortDescription,
            detailedImageLink,
            detailedDescription,
            buttonName,
            buttonLink,
          })
        );

  const handleCardClick = (route: string) => {
    router.push(route, 'forward'); // "forward" for a page transition effect
  };

  const handleAuthClick = () => {
    router.push('/login', 'forward');
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await refetch(); // Call the refetch function from useGoogleSheets
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  // Set text color to dark (for light backgrounds)
  const setStatusBarBackground = async () => {
    if (!Capacitor.isPluginAvailable('EdgeToEdge')) return;
    await EdgeToEdge.setBackgroundColor({ color: '#38e4ae' });
  };

  setStatusBarBackground();

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar color="secondary">
            <IonTitle>Navigation</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {homePageLayout.map((item, index) => (
              <IonMenuToggle key={index}>
                <IonItem
                  button
                  key={item.route}
                  onClick={() => {
                    handleCardClick(item.route);
                  }}
                >
                  <IonLabel>{item.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>
          <IonList>
            <IonMenuToggle key={homePageLayout.length + 1}>
              <IonItem
                button
                onClick={() => {
                  handleCardClick('/about');
                }}
              >
                <IonLabel>About</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader translucent={true}>
          <IonToolbar color={'primary'}>
            <IonTitle>Oak City Shred Fest 5</IonTitle>
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
                className="shred-fest-logo"
                src="/images/shred-fest-logo.webp"
                alt="Oak City Shred Fest 5"
              />
            </IonToolbar>
          </IonHeader>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <CountdownTimer />
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
          {/* {dynamicContent.map(
            (d, index) => d.enabled && <DynamicContent key={index} {...d} />
          )} */}
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
