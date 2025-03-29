import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { useIonRouter } from '@ionic/react';

// Capacitor
import { SplashScreen } from '@capacitor/splash-screen';

// Ionic Core
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';

// Context & Hooks
import { AuthProvider } from './context/AuthContext';
import useNotifications from './hooks/useNotifications';

// Routes and TabBar
import AppRoutes from './components/AppRoutes';
import AppTabBar from './components/AppTabBar';

// Firebase
import { isFirebaseInitialized } from './firebase';
import { App as CapacitorApp } from '@capacitor/app';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import { Capacitor } from '@capacitor/core';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
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

setupIonicReact();

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Only try to use Firebase Analytics if on web and Firebase is initialized
    if (isFirebaseInitialized() && !Capacitor.isNativePlatform()) {
      const screenName = location.pathname || 'Home';
      FirebaseAnalytics.setCurrentScreen({
        screenName,
        screenClassOverride: screenName,
      }).catch((error) => {
        console.error('Error setting current screen:', error);
      });
    }
  }, [location]);

  return null;
};

const App: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  const router = useIonRouter();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    CapacitorApp.addListener('appUrlOpen', (event) => {
      const url = new URL(event.url);
      if (url.host === 'quests') {
        const questId = url.pathname.split('/')[1];
        router.push(`/quests/${questId}`);
      }
    });

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [router]);

  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <AnalyticsTracker />
          <IonTabs>
            <IonRouterOutlet>
              <AppRoutes
                notifications={notifications}
                removeNotification={removeNotification}
              />
            </IonRouterOutlet>
            <AppTabBar notifications={notifications} />
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
