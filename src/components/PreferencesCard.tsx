import React from 'react';
import usePreferenceSettings from '../hooks/usePreferenceSettings';

import {
  IonCard,
  IonToggle,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
} from '@ionic/react';

const PreferencesCard: React.FC = () => {
  const [preferenceSettings, setPreferenceSettings] = usePreferenceSettings();

  const togglePreference = (key: string) => {
    setPreferenceSettings((prev) => {
      preferenceSettings[key].enabled = !preferenceSettings[key].enabled;
      return preferenceSettings;
    });
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Preferences</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {Object.keys(preferenceSettings).map((key) => (
          <IonItem key={key}>
            <IonToggle
              checked={preferenceSettings[key].enabled}
              onIonChange={() => togglePreference(key)}
            >
              {preferenceSettings[key].name}
            </IonToggle>
          </IonItem>
        ))}
      </IonCardContent>
    </IonCard>
  );
};

export default PreferencesCard;
