// React & React Router
import { useEffect } from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { useIonRouter } from '@ionic/react';

// Capacitor
import { SplashScreen } from '@capacitor/splash-screen';

// Ionic Core
import {
  IonApp,
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';

// Ionicons
import { alarm, calendar, home, map, people } from 'ionicons/icons';

// Context & Hooks
import { AuthProvider } from './context/AuthContext';
import useNotifications from './hooks/useNotifications';

// Pages
import About from './pages/About';
import DripSchedule from './pages/DripSchedule';
import EmergencyServices from './pages/EmergencyServices';
import FoodTrucks from './pages/FoodTrucks';
import Home from './pages/Home';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import Notifications from './pages/Notifications';
import QuestsPage from './pages/Quests';
import Raceing from './pages/Racing';
import RacerProfile from './pages/RacerProfile';
import Raffles from './pages/Raffles';
import ScavengerHunt from './pages/ScavengerHunt';
import SchedulePage from './pages/SchedulePage';
import TrickCompPage from './pages/TrickComp';
import Team from './pages/Team';
import Sponsors from './pages/Sponsors';
import FireBaseAppCheckPage from './pages/FireBaseAppCheckPage';

import { firebaseApp } from './firebase'; // Import Firebase setup
import { App as CapacitorApp } from '@capacitor/app';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Theme
import './theme/variables.css';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import TicketsPage from './pages/TicketsPage';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
//import '@ionic/react/css/palettes/dark.system.css';

console.log('Firebase initialized:', firebaseApp ? 'Web' : 'Native');

setupIonicReact();

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const screenName = location.pathname || 'Home'; // Customize as needed
    FirebaseAnalytics.setCurrentScreen({
      screenName,
      screenClassOverride: screenName, // Optional: override CAPBridgeViewController
    })
      .then(() => console.log(`Screen set to: ${screenName}`))
      .catch((err) => console.error('Error setting screen:', err));
  }, [location]);

  return null;
};

const App: React.FC = () => {
  const { notifications, removeNotification, notificationPermission } =
    useNotifications();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const router = useIonRouter();
  useEffect(() => {
    CapacitorApp.addListener('appUrlOpen', (event) => {
      const url = new URL(event.url);
      const pathname = url.pathname;
      if (pathname === '/tickets') {
        router.push('/tickets');
      }
      console.log('deep link2: ', url);
      console.log('deep link host name: ', url.host);
      if (url.host === 'quests') {
        const questId = url.pathname.split('/')[1]; // Get questId (2)
        const key = url.searchParams.get('key'); // Get key (abc)
        console.log('found a quest');
        console.log('history.push ', `/quests/${questId}?key=${key}`);
        router.push(`/quests/${questId}`);
        console.log('pushed');
      }
    });

    return () => {
      CapacitorApp.removeAllListeners();
      console.log('App cleanup - all listeners removed');
    };
  }, [router]);

  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <AnalyticsTracker />
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/racer-profile/:racerId">
                <RacerProfile />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/drip-schedule">
                <DripSchedule />
              </Route>
              <Route path="/app-check">
                <FireBaseAppCheckPage />
              </Route>
              <Route path="/emergency-services">
                <EmergencyServices />
              </Route>
              <Route path="/food-trucks">
                <FoodTrucks />
              </Route>
              <Route exact path="/home">
                <Home
                  notifications={notifications}
                  removeNotification={removeNotification}
                  notificationPermission={notificationPermission}
                />
              </Route>
              <Route exact path="/login" component={Login} />
              <Route exact path="/map/:locationName?">
                <MapPage />
              </Route>
              <Route path="/notifications">
                <Notifications notifications={notifications} />
              </Route>
              <Route path="/quests/:questId">
                <QuestsPage />
              </Route>
              <Route path="/quests">
                <QuestsPage />
              </Route>
              <Route path="/tickets">
                <TicketsPage />
              </Route>
              <Route path="/race-information">
                <Raceing />
              </Route>
              <Route path="/raffles-giveaways">
                <Raffles />
              </Route>
              <Route path="/schedule">
                <SchedulePage />
              </Route>
              <Route path="/scavenger-hunt">
                <ScavengerHunt />
              </Route>
              <Route path="/trick-comp">
                <TrickCompPage />
              </Route>
              <Route path="/team">
                <Team />
              </Route>
              <Route path="/sponsors">
                <Sponsors />
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </IonRouterOutlet>
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
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
