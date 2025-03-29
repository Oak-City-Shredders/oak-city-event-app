import React, { useEffect, useMemo, useState } from 'react';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';
import {
  FirebaseAppCheck,
  InitializeOptions,
  GetTokenOptions,
} from '@capacitor-firebase/app-check';
import {
  IonPage,
  IonHeader,
  IonContent,
  IonButton,
  IonItem,
  IonCheckbox,
  IonLabel,
} from '@ionic/react';
import PageHeader from '../components/PageHeader';
import { ReCaptchaV3Provider } from 'firebase/app-check';
import { isFirebaseInitialized, app } from '../firebase';
import { Capacitor } from '@capacitor/core';

const FireBaseAppCheckPage: React.FC = () => {
  const [useDebugProvider, setUseDebugProvider] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  const githubUrl = 'https://github.com/robingenz/capacitor-firebase';

  useEffect(() => {
    // Set the current screen for Firebase Analytics
    if (!Capacitor.isNativePlatform()) {
      FirebaseAnalytics.setCurrentScreen({
        screenName: 'FirebaseAppPage',
      }).catch((error) => {
        console.error('Error setting screen for analytics:', error);
      });
    }
  }, []);

  // Ensure FirebaseAppCheck is initialized once
  useMemo(() => {
    const initializeAppCheck = async () => {
      try {
        // Check if Firebase is initialized before proceeding
        if (!isFirebaseInitialized() || !app) {
          setInitError('Firebase is not initialized');
          return;
        }

        setInitError(null);

        const options: InitializeOptions = {
          debug: true, //useDebugProvider
          provider: new ReCaptchaV3Provider(
            '6LfsPe4qAAAAAL5dFhgow0-YHzJbfGjv8gVcpL17'
          ),
        };
        await FirebaseAppCheck.initialize(options);
        console.log('Firebase App Check initialized successfully');
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        setInitError(errorMessage);
        console.error('Error initializing FirebaseAppCheck:', error);
      }
    };

    initializeAppCheck();
  }, [useDebugProvider]);

  const fetchToken = async () => {
    try {
      if (!isFirebaseInitialized()) {
        setInitError('Cannot fetch token: Firebase is not initialized');
        return;
      }

      const options: GetTokenOptions = { forceRefresh: true };
      const { token } = await FirebaseAppCheck.getToken(options);
      setToken(token);
    } catch (error) {
      console.error('Error fetching Firebase token:', error);
      setToken(null);
    }
  };

  const openOnGithub = () => {
    window.open(githubUrl, '_blank');
  };

  return (
    <IonPage>
      <PageHeader title="Firebase App Check" />
      <IonContent className="ion-padding">
        <h1 className="text-xl font-bold">Firebase App Check</h1>

        {/* Firebase Status */}
        <div className="my-2">
          <p
            className={`text-sm ${
              isFirebaseInitialized() ? 'text-green-600' : 'text-red-600'
            }`}
          >
            Firebase Status:{' '}
            {isFirebaseInitialized() ? 'Initialized' : 'Not Initialized'}
          </p>
        </div>

        {/* Error Message */}
        {initError && (
          <div className="my-2 p-2 bg-red-100 text-red-700 rounded">
            <p>{initError}</p>
          </div>
        )}

        {/* Debug Provider Checkbox */}
        <IonItem>
          <IonCheckbox
            checked={useDebugProvider}
            onIonChange={(e) => setUseDebugProvider(e.detail.checked)}
          />
          <IonLabel className="ml-2">Use Debug Provider</IonLabel>
        </IonItem>

        {/* Buttons */}
        <div className="flex space-x-2 mt-4">
          <IonButton
            color="primary"
            onClick={fetchToken}
            disabled={!isFirebaseInitialized()}
          >
            Get Token
          </IonButton>
          <IonButton color="dark" onClick={openOnGithub}>
            View on GitHub
          </IonButton>
        </div>

        {/* Display Token */}
        {token && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p>
              <strong>Token:</strong> {token}
            </p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default FireBaseAppCheckPage;
