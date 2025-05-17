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
  useIonRouter,
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
import TicketCounter, { FireDBTicketsSold } from '../components/TicketCounter';
import usePreferenceSettings from '../hooks/usePreferenceSettings';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { useRefreshHandlers } from '../hooks/useRefreshHandler';
import NextEvent from '../components/NextEvent';
import HomePageMenu from '../components/HomePageMenu';
import RacerSpotlight from '../components/RacerSpotlight';
import FoodTruckSwiper from '../components/FoodTruckSwiper';
import { PermissionState } from '@capacitor/core';
import OutdatedVersionNotice, {
  isVersionOutdated,
} from '../components/OutdatedVersionNotice';
import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { FireDBFoodTruck } from '../utils/foodTruckUtils';
import useGoogleCalendar from '../hooks/useGoogleCalendar';
import { useCurrentEvent } from '../context/CurrentEventContext';

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
  contentType: string;
  insertBefore?: string;
  positionPriority?: number;
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

function reorderContent<
  T extends {
    id: string;
    insertBefore?: string;
    positionPriority?: number;
    datePosted: Date;
  }
>(items: T[]): T[] {
  const sorted = [...items].sort(
    (a, b) =>
      new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
  );

  const overrides = sorted
    .filter((item) => item.insertBefore)
    .sort(
      (a, b) => (a.positionPriority ?? 1000) - (b.positionPriority ?? 1000)
    );

  for (const override of overrides) {
    const currentIndex = sorted.findIndex((i) => i.id === override.id);
    const targetIndex = sorted.findIndex((i) => i.id === override.insertBefore);

    if (currentIndex === -1 || targetIndex === -1) continue;

    const [moved] = sorted.splice(currentIndex, 1);
    const newIndex = currentIndex < targetIndex ? targetIndex - 1 : targetIndex;
    sorted.splice(newIndex, 0, moved);
  }

  return sorted;
}

const Home: React.FC<HomeProps> = ({
  notifications,
  removeNotification,
  notificationPermission,
}) => {
  const router = useIonRouter();
  const [showCountdown, setShowCountdown] = useState(true);
  const { data, refetch: refetchDynamicContent } =
    useFireStoreDB<FireDBDynamicContent>('DynamicContent');
  const { data: versionData, refetch: versionRefetch } =
    useFireStoreDB<FireDBVersion>('versions');
  const {
    data: dataTicketCounter,
    loading: loadingTicketCounter,
    refetch: refetchTicketCounter,
    error: errorTicketCounter,
  } = useFireStoreDB<FireDBTicketsSold>('TicketsSold');

  const {
    loading: loadingCalendar,
    error: errorCalendar,
    refetch: refetchCalendar,
    getUpcomingEvents,
  } = useGoogleCalendar();
  const upcomingEvents = getUpcomingEvents();

  const platform = Capacitor.getPlatform();
  const minVersion = !versionData
    ? '0.0.0'
    : versionData.find((v) => v.platform === platform)?.minVersion || '0.0.0';

  const { eventInfo, loadingEventInfo } = useCurrentEvent();
  const eventTitle = eventInfo.title || '';

  const [currentVersion, setCurrentVersion] = useState<string>('0.0.0');
  useEffect(() => {
    const fetchAppInfo = async () => {
      try {
        const info = await App.getInfo();
        setCurrentVersion(info.version);
      } catch (error) {
        console.error('Error fetching app info:', error);
      }
    };

    platform !== 'web' && fetchAppInfo();
  }, []);

  const [preferenceSettings] = usePreferenceSettings();

  const {
    data: dataFoodTruck,
    loading: loadingFoodTruck,
    error: errorFoodTruck,
    refetch: refetchFoodTruck,
  } = useFireStoreDB<FireDBFoodTruck>('FoodTrucks');

  const handleRefresh = useRefreshHandlers([
    refetchDynamicContent,
    refetchFoodTruck,
    versionRefetch,
    refetchCalendar,
    refetchTicketCounter,
  ]);

  const dynamicContent: DynamicContentProps[] = !data
    ? []
    : reorderContent(
        data
          .map((dc) => ({
            id: dc.id,
            contentType: dc.contentType ?? 'DYNAMIC',
            enabled: dc.Enabled === 'Yes',
            imageLink: dc['Image Link'],
            title: dc.Title,
            subtitle: dc.Subtitle,
            datePosted: new Date(dc['Date Posted']),
            shortDescription: dc['Short Description'],
            detailedImageLink: dc['Detailed Image link'],
            detailedDescription: dc['Detailed Description'],
            buttonName: dc['Button Name'],
            buttonLink: dc['Button Link'],
            insertBefore: dc.insertBefore,
            positionPriority: dc.positionPriority,
          }))
          .filter((dc) => dc.enabled)
      );

  // Set text color to dark (for light backgrounds)
  const setStatusBarBackground = async () => {
    if (!Capacitor.isPluginAvailable('EdgeToEdge')) return;
    await EdgeToEdge.setBackgroundColor({ color: '#38e4ae' });
  };

  const colSize = '12';
  const colSizeLg = '4';

  setStatusBarBackground();

  return (
    <>
      <HomePageMenu />
      <IonPage id="main-content">
        <IonHeader translucent={true}>
          <IonToolbar color={'primary'}>
            <IonTitle>{loadingEventInfo ? `` : eventTitle}</IonTitle>
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
                src={eventInfo.titleImage}
                alt={eventTitle}
              />
            </IonToolbar>
          </IonHeader>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <IonGrid>
            <IonRow>
              {isVersionOutdated(currentVersion, minVersion) && (
                <IonCol size={colSize} sizeLg={colSizeLg} key={100}>
                  <OutdatedVersionNotice
                    currentVersion={currentVersion}
                    minVersion={minVersion}
                  />
                </IonCol>
              )}

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
              {dynamicContent.map((d, index) => {
                switch (d.contentType) {
                  case 'DYNAMIC':
                    return (
                      <IonCol size={colSize} sizeLg={'4'} key={index}>
                        <DynamicContent {...d} />
                      </IonCol>
                    );
                  case 'NEXT_EVENT':
                    return (
                      !loadingCalendar &&
                      !errorCalendar &&
                      upcomingEvents.length >= 1 && (
                        <IonCol size={colSize} sizeLg={colSizeLg} key={index}>
                          <NextEvent
                            loading={loadingCalendar}
                            error={errorCalendar}
                            upcomingEvents={upcomingEvents}
                          />
                        </IonCol>
                      )
                    );
                  case 'FOOD_TRUCK_SWIPER':
                    return (
                      eventInfo.foodTrucksEnabled && (
                        <IonCol size={colSize} sizeLg={'4'} key={index}>
                          <FoodTruckSwiper
                            loading={loadingFoodTruck}
                            error={errorFoodTruck}
                            foodTrucks={dataFoodTruck}
                          />
                        </IonCol>
                      )
                    );
                  case 'FEATURED_COMPETITOR':
                    return (
                      eventInfo.featuredCompetitorEnabled && (
                        <IonCol size={colSize} sizeLg={'4'} key={index}>
                          <RacerSpotlight />
                        </IonCol>
                      )
                    );
                  case 'STOKE_METER':
                    return (
                      preferenceSettings['stokeMeter'].enabled && (
                        <IonCol size={colSize} sizeLg={colSizeLg} key={index}>
                          <StokeMeter />
                        </IonCol>
                      )
                    );
                  case 'TICKET_COUNTER':
                    return (
                      preferenceSettings['ticketCounter'].enabled &&
                      eventInfo.ticketsSoldEnabled && (
                        <IonCol size={colSize} sizeLg={colSizeLg} key={index}>
                          <TicketCounter
                            error={errorTicketCounter}
                            loading={loadingTicketCounter}
                            data={dataTicketCounter}
                          />
                        </IonCol>
                      )
                    );
                  case 'COUNTDOWN':
                    return (
                      showCountdown &&
                      preferenceSettings['countDown'].enabled && (
                        <IonCol size={colSize} sizeLg={'4'} key={index}>
                          <CountdownTimer
                            onFinish={() => setShowCountdown(false)}
                          />
                        </IonCol>
                      )
                    );
                  default:
                    return null;
                }
              })}
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
