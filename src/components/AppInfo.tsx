import React, { useEffect, useState } from 'react';
import { IonText, IonCard, IonCardContent } from '@ionic/react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const AppInfo: React.FC = () => {
  const [buildNumber, setBuildNumber] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  if (!Capacitor.isNativePlatform()) return <></>;

  useEffect(() => {
    const fetchAppInfo = async () => {
      try {
        const info = await App.getInfo();
        setVersion(info.version); // e.g., "1.0.0"
        setBuildNumber(info.build); // e.g., "42"
      } catch (error) {
        console.error('Error fetching app info:', error);
      }
    };

    fetchAppInfo();
  }, []);

  return (
    <IonCard>
      <IonCardContent>
        <IonText>Version: {version}</IonText>
        <br />
        <IonText>Build: {buildNumber}</IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default AppInfo;
