// React & React Router
import { useEffect } from 'react';
import { Redirect, Route, useLocation, Switch } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { IonContent, IonPage, useIonRouter } from '@ionic/react';

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
import NotFound from './components/NotFound';
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

const TabsLayout: React.FC = () => {
  const { notifications, removeNotification, notificationPermission } =
    useNotifications();

  const location = useLocation();

  // List of routes that should show the tab bar
  const showTabs = ['/home', '/schedule', '/map'].includes(location.pathname);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/racer-profile/:racerId" exact={true}>
          <RacerProfile />
        </Route>
        <Route path="/about" exact={true}>
          <About />
        </Route>
        <Route path="/drip-schedule" exact={true}>
          <DripSchedule />
        </Route>
        <Route path="/app-check" exact={true}>
          <FireBaseAppCheckPage />
        </Route>
        <Route path="/emergency-services" exact={true}>
          <EmergencyServices />
        </Route>
        <Route path="/food-trucks" exact={true}>
          <FoodTrucks />
        </Route>
        <Route path="/home" exact={true}>
          <Home
            notifications={notifications}
            removeNotification={removeNotification}
            notificationPermission={notificationPermission}
          />
        </Route>
        <Route path="/login" exact={true} component={Login} />
        <Route path="/map/:locationName?" exact={true}>
          <MapPage />
        </Route>
        <Route path="/notifications" exact={true}>
          <Notifications notifications={notifications} />
        </Route>
        <Route path="/quests/:questId" exact={true}>
          <QuestsPage />
        </Route>
        <Route path="/quests" exact={true}>
          <QuestsPage />
        </Route>
        <Route path="/tickets" exact={true}>
          <TicketsPage />
        </Route>
        <Route path="/race-information" exact={true}>
          <Raceing />
        </Route>
        <Route path="/raffles-giveaways" exact={true}>
          <Raffles />
        </Route>
        <Route path="/schedule" exact={true}>
          <SchedulePage />
        </Route>
        <Route path="/scavenger-hunt" exact={true}>
          <ScavengerHunt />
        </Route>
        <Route path="/trick-comp" exact={true}>
          <TrickCompPage />
        </Route>
        <Route path="/team" exact={true}>
          <Team />
        </Route>
        <Route path="/sponsors" exact={true}>
          <Sponsors />
        </Route>
        <Route path="/" exact={true}>
          <Redirect to="/home" />
        </Route>
        <Route>
          <NotFound />
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
  );
};

const App: React.FC = () => {
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

  // Create an EmailVerified component
  const EmailVerified = () => (
    <IonPage>
      <IonContent>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Email Verification Successful!</h2>
          <p>Thank you for verifying your email address.</p>
          <IonBadge color="success">Verified</IonBadge>
        </div>
      </IonContent>
    </IonPage>
  );

  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <AnalyticsTracker />

          {/* Main router outlet - contains both standalone and tabbed routes */}
          <IonRouterOutlet>
            <Switch>
              {/* Standalone routes without tabs */}
              <Route path="/email-verified" exact>
                <EmailVerified />
              </Route>

              <Route
                path="/racer-profile/:racerId"
                exact={true}
                component={TabsLayout}
              />
              <Route path="/about" exact={true} component={TabsLayout} />
              <Route
                path="/drip-schedule"
                exact={true}
                component={TabsLayout}
              />
              <Route path="/app-check" exact={true} component={TabsLayout} />
              <Route
                path="/emergency-services"
                exact={true}
                component={TabsLayout}
              />
              <Route path="/food-trucks" exact={true} component={TabsLayout} />
              <Route path="/home" exact={true} component={TabsLayout} />
              <Route path="/login" exact={true} component={TabsLayout} />
              <Route
                path="/map/:locationName?"
                exact={true}
                component={TabsLayout}
              />
              <Route
                path="/notifications"
                exact={true}
                component={TabsLayout}
              />
              <Route
                path="/quests/:questId"
                exact={true}
                component={TabsLayout}
              />
              <Route path="/quests" exact={true} component={TabsLayout} />
              <Route path="/tickets" exact={true} component={TabsLayout} />
              <Route
                path="/race-information"
                exact={true}
                component={TabsLayout}
              />
              <Route
                path="/raffles-giveaways"
                exact={true}
                component={TabsLayout}
              />
              <Route path="/schedule" exact={true} component={TabsLayout} />
              <Route
                path="/scavenger-hunt"
                exact={true}
                component={TabsLayout}
              />
              <Route path="/trick-comp" exact={true} component={TabsLayout} />
              <Route path="/team" exact={true} component={TabsLayout} />
              <Route path="/sponsors" exact={true} component={TabsLayout} />
              <Redirect exact from="/" to="/home" />
              <Route component={NotFound} />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
