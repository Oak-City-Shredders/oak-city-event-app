// React & React Router
import React, { useEffect, lazy, Suspense } from 'react';
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
import { calendar, chatbox, home, map } from 'ionicons/icons';

// Context & Hooks
import { AuthProvider } from './context/AuthContext';
import useNotifications from './hooks/useNotifications';

//Load page components
import Home from './pages/Home';

import LoadingSpinner from './components/LoadingSpinner';

// Lazy loaded page components
const About = lazy(() => import('./pages/About'));
const DripSchedule = lazy(() => import('./pages/DripSchedule'));
const EmergencyServices = lazy(() => import('./pages/EmergencyServices'));
const FoodTrucks = lazy(() => import('./pages/FoodTrucks'));
const Login = lazy(() => import('./pages/Login'));
const MapPage = lazy(() => import('./pages/MapPage'));
const Notifications = lazy(() => import('./pages/Notifications'));
const QuestsPage = lazy(() => import('./pages/Quests'));
const Raceing = lazy(() => import('./pages/Racing'));
const RacerProfile = lazy(() => import('./pages/RacerProfile'));
const Raffles = lazy(() => import('./pages/Raffles'));
const ScavengerHunt = lazy(() => import('./pages/ScavengerHunt'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const TrickCompPage = lazy(() => import('./pages/TrickComp'));
const Team = lazy(() => import('./pages/Team'));
const Sponsors = lazy(() => import('./pages/Sponsors'));
const NotFound = lazy(() => import('./components/NotFound'));
const FireBaseAppCheckPage = lazy(() => import('./pages/FireBaseAppCheckPage'));
const TicketsPage = lazy(() => import('./pages/TicketsPage'));
const StokeBot = lazy(() => import('./pages/StokeBot'));

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

import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

// Theme
import './theme/variables.css';
import '@ionic/react/css/palettes/dark.system.css';

console.log('Firebase initialized:', firebaseApp ? 'Web' : 'Native');

setupIonicReact();

// Loading component for Suspense fallback
const LoadingComponent = () => (
  <IonPage>
    <IonContent className="ion-padding ion-text-center">
      <LoadingSpinner />
    </IonContent>
  </IonPage>
);

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
      <IonRouterOutlet animated={false}>
        <Route path="/stoke-bot" exact>
          <Suspense fallback={<LoadingComponent />}>
            <StokeBot />
          </Suspense>
        </Route>
        <Route path="/racer-profile/:racerId" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <RacerProfile />
          </Suspense>
        </Route>
        <Route path="/about" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <About />
          </Suspense>
        </Route>
        <Route path="/drip-schedule" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <DripSchedule />
          </Suspense>
        </Route>
        <Route path="/app-check" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <FireBaseAppCheckPage />
          </Suspense>
        </Route>
        <Route path="/emergency-services" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <EmergencyServices />
          </Suspense>
        </Route>
        <Route path="/food-trucks" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <FoodTrucks />
          </Suspense>
        </Route>
        <Route path="/home" exact={true}>
          <Home
            notifications={notifications}
            removeNotification={removeNotification}
            notificationPermission={notificationPermission}
          />
        </Route>
        <Route path="/login" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <Login />
          </Suspense>
        </Route>
        <Route path="/map/:locationName?" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <MapPage />
          </Suspense>
        </Route>
        <Route path="/notifications" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <Notifications notifications={notifications} />
          </Suspense>
        </Route>
        <Route path="/quests/:questId" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <QuestsPage />
          </Suspense>
        </Route>
        <Route path="/quests" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <QuestsPage />
          </Suspense>
        </Route>
        <Route path="/tickets" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <TicketsPage />
          </Suspense>
        </Route>
        <Route path="/race-information" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <Raceing />
          </Suspense>
        </Route>
        <Route path="/raffles-giveaways" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <Raffles />
          </Suspense>
        </Route>
        <Route path="/schedule" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <SchedulePage />
          </Suspense>
        </Route>
        <Route path="/scavenger-hunt" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <ScavengerHunt />
          </Suspense>
        </Route>
        <Route path="/trick-comp" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <TrickCompPage />
          </Suspense>
        </Route>
        <Route path="/team" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <Team />
          </Suspense>
        </Route>
        <Route path="/sponsors" exact={true}>
          <Suspense fallback={<LoadingComponent />}>
            <Sponsors />
          </Suspense>
        </Route>
        <Route path="/" exact={true}>
          <Redirect to="/home" />
        </Route>
        <Route>
          <Suspense fallback={<LoadingComponent />}>
            <NotFound />
          </Suspense>
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
        <IonTabButton tab="stoke-bot" href="/stoke-bot">
          <IonIcon aria-hidden="true" icon={chatbox} />
          <IonLabel>StokeBot</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

// Make TabsLayout lazy-loaded too
const LazyTabsLayout = lazy(() => Promise.resolve({ default: TabsLayout }));

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
          <IonRouterOutlet animated={false}>
            <Switch>
              {/* Standalone routes without tabs */}
              <Route path="/email-verified" exact>
                <EmailVerified />
              </Route>
              {/* Routes with tabs - now wrapped with Suspense */}
              <Route path="/stoke-bot" exact>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/racer-profile/:racerId" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/about" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/drip-schedule" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/app-check" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/emergency-services" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/food-trucks" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/home" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/login" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/map/:locationName?" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/notifications" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/quests/:questId" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/quests" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/tickets" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/race-information" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/raffles-giveaways" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/schedule" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/scavenger-hunt" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/trick-comp" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/team" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Route path="/sponsors" exact={true}>
                <Suspense fallback={<LoadingComponent />}>
                  <LazyTabsLayout />
                </Suspense>
              </Route>
              <Redirect exact from="/" to="/home" />
              <Route>
                <Suspense fallback={<LoadingComponent />}>
                  <NotFound />
                </Suspense>
              </Route>
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
