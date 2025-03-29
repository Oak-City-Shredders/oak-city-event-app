import './Home.css';
import CardLayout from '../components/CardLayout';
import { homePageLayout } from '../data/homePageLayout';
import {
  IonContent,
  IonHeader,
  IonImg,
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
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
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
import CountdownTimer from '../components/CountdownTimer';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { Capacitor } from '@capacitor/core';
import TicketCounter from '../components/TicketCounter';
import usePreferenceSettings from '../hooks/usePreferenceSettings';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { useRefreshHandlers } from '../hooks/useRefreshHandler';
import NextEvent from '../components/NextEvent';
import HomePageMenu from '../components/HomePageMenu';
import RacerSpotlight from '../components/RacerSpotlight';
import FoodTruckSwiper from '../components/FoodTruckSwiper';
import {
  useFoodTruckData,
  useRandomRacerId,
} from '../hooks/useRefetchableData';
import useGoogleCalendar from '../hooks/useGoogleCalendar';

const iconMap = {
  race: flagOutline, // Racing related
  time: timeOutline, // Time related
};

const shredFestStartDate = '2025-04-24';

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

interface FireDBDynamicContent {
  'Button Link': string;
  'Button Name': string;
  'Date Posted': string;
  'Detailed Description': string;
  'Detailed Image link': string;
  Enabled: string;
  'Image Link': string;
  'Short Description': string;
  Subtitle: string;
  Title: string;
  id: string;
}

const Home: React.FC<HomeProps> = ({ notifications, removeNotification }) => {
  const router = useIonRouter();

  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBDynamicContent>('DynamicContent');
  const [preferenceSettings, setPreferenceSettings] = usePreferenceSettings();

  const { refetch: refetchFoodTruck } = useFoodTruckData();
  const { refetch: refetchRacerSpotlight } = useRandomRacerId();
  const { refetch: refetchCalendar } = useGoogleCalendar(5);
  const handleRefresh = useRefreshHandlers([
    refetch,
    refetchFoodTruck,
    refetchRacerSpotlight,
    refetchCalendar,
  ]);

  const dynamicContent: DynamicContentProps[] = !data
    ? []
    : data
        .map((dc) => ({
          enabled: dc.Enabled === 'Yes',
          imageLink: dc['Image Link'],
          title: dc.Title,
          subtitle: dc.Subtitle,
          datePosted: dc['Date Posted'],
          shortDescription: dc['Short Description'],
          detailedImageLink: dc['Detailed Image link'],
          detailedDescription: dc['Detailed Description'],
          buttonName: dc['Button Name'],
          buttonLink: dc['Button Link'],
        }))
        .reverse();

  const handleCardClick = (route: string) => {
    router.push(route, 'forward'); // "forward" for a page transition effect
  };

  // Set text color to dark (for light backgrounds)
  const setStatusBarBackground = async () => {
    if (!Capacitor.isPluginAvailable('EdgeToEdge')) return;
    await EdgeToEdge.setBackgroundColor({ color: '#38e4ae' });
  };

  const colSize = '12';
  const colSizeLg = '6';

  setStatusBarBackground();

  return (
    <>
      <HomePageMenu homePageLayout={homePageLayout}></HomePageMenu>
      <IonPage id="main-content">
        <IonHeader translucent={true}>
          <IonToolbar color={'primary'}>
            <IonTitle>Oak City Shred Fest 5</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/login">
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
          <IonGrid>
            <IonRow>
              {/* active notifications */}
              {notifications.length > 0 && (
                <IonCol size={colSize} sizeLg={colSizeLg} key={1}>
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
                </IonCol>
              )}
              <IonCol size={colSize} sizeLg={colSizeLg} key={2}>
                <NextEvent />
              </IonCol>

              {preferenceSettings['ticketCounter'].enabled && (
                <IonCol size={colSize} sizeLg={colSizeLg} key={3}>
                  <TicketCounter />
                </IonCol>
              )}

              {preferenceSettings['countDown'].enabled && (
                <IonCol size={colSize} sizeLg={colSizeLg} key={4}>
                  <CountdownTimer />
                </IonCol>
              )}
              {new Date() <= new Date(shredFestStartDate) &&
                preferenceSettings['stokeMeter'].enabled && (
                  <IonCol size={colSize} sizeLg={colSizeLg} key={5}>
                    <StokeMeter />
                  </IonCol>
                )}

              <IonCol size={colSize} sizeLg={colSizeLg} key={6}>
                {/* <RacerSpotlight /> */}
              </IonCol>
              <IonCol size={colSize} sizeLg={colSizeLg} key={7}>
                <FoodTruckSwiper />
              </IonCol>
            </IonRow>
          </IonGrid>
          <CardLayout
            items={homePageLayout}
            handleCardClick={handleCardClick}
          />
          <IonGrid>
            <IonRow>
              {dynamicContent.map(
                (d, index) =>
                  d.enabled && (
                    <IonCol size={colSize} sizeLg={'4'} key={index}>
                      <DynamicContent {...d} />
                    </IonCol>
                  )
              )}
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
