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

const FireBaseAppCheckPage: React.FC = () => {
  const [useDebugProvider, setUseDebugProvider] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const githubUrl = 'https://github.com/robingenz/capacitor-firebase';

  useEffect(() => {
    // Set the current screen for Firebase Analytics
    FirebaseAnalytics.setCurrentScreen({ screenName: 'FirebaseAppPage' });
  }, []);

  // Ensure FirebaseAppCheck is initialized once
  useMemo(() => {
    const initializeAppCheck = async () => {
      try {
        const options: InitializeOptions = {
          debug: true, //useDebugProvider
          provider: new ReCaptchaV3Provider(
            '6LfsPe4qAAAAAL5dFhgow0-YHzJbfGjv8gVcpL17'
          ),
        };
        await FirebaseAppCheck.initialize(options);
        console.log('FirebaseAppCheck initialized');
      } catch (error) {
        console.error('Error initializing FirebaseAppCheck:', error);
      }
    };

    initializeAppCheck();
  }, [useDebugProvider]);

  const fetchToken = async () => {
    try {
      const options: GetTokenOptions = { forceRefresh: true };
      const { token } = await FirebaseAppCheck.getToken(options);
      setToken(token);
      console.log('Token:', token);
    } catch (error) {
      console.error('Error fetching Firebase token:', error);
    }
  };

  const openOnGithub = () => {
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <IonPage>
      <PageHeader title="Firebase App Check" />
      <IonContent className="ion-padding">
        <h1 className="text-xl font-bold">Firebase App Check</h1>

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
          <IonButton color="primary" onClick={fetchToken}>
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
