import './Home.css';
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
  IonRefresher,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import {
  personCircleOutline,
  notificationsOutline,
  timeOutline,
  flagOutline,
  closeOutline,
  notificationsOff,
  notifications as notificationsIcon,
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
import { PermissionState } from '@capacitor/core';
import OutdatedVersionNotice from '../components/OutdatedVersionNotice';
import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';

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
  notificationPermission: PermissionState;
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

interface FireDBVersion {
  id: string;
  priority: string;
  minVersion: string;
  platform: string;
}

const Home: React.FC<HomeProps> = ({
  notifications,
  removeNotification,
  notificationPermission,
}) => {
  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBDynamicContent>('DynamicContent');
  const {
    data: versionData,
    loading: versionLoading,
    error: versionError,
    refetch: versionRefetch,
  } = useFireStoreDB<FireDBVersion>('versions');

  const platform = Capacitor.getPlatform();
  const minVersion = !versionData
    ? '0.0.0'
    : versionData.find((v) => v.platform === platform)?.minVersion || '0.0.0';
  console.log('minVersion', minVersion);

  const [currentVersion, setCurrentVersion] = useState<string>('0.0.0');
  useEffect(() => {
    const fetchAppInfo = async () => {
      try {
        const info = await App.getInfo();
        setCurrentVersion(info.version); // e.g., "1.0.0"
        console.log('currentVersion', info.version);

        //setBuildNumber(info.build); // e.g., "42"
      } catch (error) {
        console.error('Error fetching app info:', error);
      }
    };

    platform !== 'web' && fetchAppInfo();
  }, []);

  const [preferenceSettings, setPreferenceSettings] = usePreferenceSettings();

  const { refetch: refetchFoodTruck } = useFoodTruckData();
  const { refetch: refetchRacerSpotlight } = useRandomRacerId();
  //const { refetch: refetchCalendar } = useGoogleCalendar(5);
  const handleRefresh = useRefreshHandlers([
    refetch,
    refetchFoodTruck,
    refetchRacerSpotlight,
    //refetchCalendar,
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
        .sort(
          (a, b) =>
            new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
        );

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
      <HomePageMenu />
      <IonPage id="main-content">
        <IonHeader translucent={true}>
          <IonToolbar color={'primary'}>
            <IonTitle>Oak City Shred Fest 5</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/notifications">
                <IonIcon
                  color="dark"
                  icon={
                    notificationPermission === 'granted'
                      ? notificationsIcon
                      : notificationsOff
                  }
                />
                {notifications.length > 0 && (
                  <IonBadge color="danger">{notifications.length}</IonBadge>
                )}
              </IonButton>
              <IonButton routerLink="/login">
                <IonIcon color="dark" icon={personCircleOutline} size="large" />
              </IonButton>
            </IonButtons>
            <IonButtons slot="start">
              <IonMenuButton color="dark"></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonImg
                className="shred-fest-logo"
                src="/images/shred-fest-logo-horizontal3.webp"
                alt="Oak City Shred Fest 5"
              />
            </IonToolbar>
          </IonHeader>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <IonGrid>
            <IonRow>
              <IonCol size={colSize} sizeLg={colSizeLg} key={100}>
                <OutdatedVersionNotice
                  currentVersion={currentVersion}
                  minVersion={minVersion}
                  loading={false}
                />
              </IonCol>
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

              {preferenceSettings['ticketCounter'].enabled && (
                <IonCol size={colSize} sizeLg={colSizeLg} key={3}>
                  <TicketCounter />
                </IonCol>
              )}
              <IonCol size={colSize} sizeLg={colSizeLg} key={2}>
                <NextEvent />
              </IonCol>

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
                <RacerSpotlight />
              </IonCol>
              <IonCol size={colSize} sizeLg={colSizeLg} key={7}>
                <IonCard
                  style={{ marginTop: 0, marginBottom: 0 }}
                  button
                  onClick={() => (window.location.href = '/scavenger-hunt')}
                >
                  <img src="/images/scavenger-hunt/fake-squirrels.webp" />
                  <IonCardHeader>
                    <IonCardTitle>Squirrel Scavenger Hunt</IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent style={{ paddingBottom: '0px' }}>
                    Find purple, green, and gold squirrels. Each color unlocks a
                    different kind of prize generously provided by our amazing
                    sponsors. Some prizes are big, we're talking $150+ big!
                  </IonCardContent>
                  <IonButton fill="clear" routerLink="/scavenger-hunt">
                    Learn more
                  </IonButton>
                </IonCard>
              </IonCol>
              <IonCol size={colSize} sizeLg={colSizeLg} key={8}>
                <FoodTruckSwiper />
              </IonCol>
            </IonRow>
          </IonGrid>
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
