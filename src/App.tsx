// React & React Router
import { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

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
import Map from './pages/Map';
import Notifications from './pages/Notifications';
import QuestsPage from './pages/Quests';
import Raceing from './pages/Racing';
import Raffles from './pages/Raffles';
import ScavengerHunt from './pages/ScavengerHunt';
import SchedulePage from './pages/SchedulePage';
import TrickCompPage from './pages/TrickComp';
import Team from './pages/Team';

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
//import '@ionic/react/css/palettes/dark.system.css';

setupIonicReact();

const App: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/drip-schedule">
                <DripSchedule />
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
                />
              </Route>
              <Route exact path="/login" component={Login} />
              <Route exact path="/map/:locationName?">
                <Map />
              </Route>
              <Route path="/notifications">
                <Notifications notifications={notifications} />
              </Route>
              <Route path="/quests">
                <QuestsPage />
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
              <IonTabButton tab="team" href="/team">
                <IonIcon aria-hidden="true" icon={people} />
                <IonLabel>Team</IonLabel>
              </IonTabButton>
              <IonTabButton tab="notifcations" href="/notifications">
                <IonIcon icon={alarm} />
                {notifications.length > 0 && (
                  <IonBadge color="danger">{notifications.length}</IonBadge>
                )}
                <IonLabel>Notifications </IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
