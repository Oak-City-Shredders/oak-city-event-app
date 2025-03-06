import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

interface Preference {
  enabled: boolean;
  name: string;
}
const defaultPreferenceSettings = {
  countDown: {
    enabled: true,
    name: 'Count Down',
  },
  stokeMeter: {
    enabled: true,
    name: 'Stoke Meter',
  },
  ticketCounter: {
    enabled: true,
    name: 'Ticket Counter',
  },
};

const usePreferenceSettings = (): [
  Record<string, Preference>,
  (
    value:
      | Record<string, Preference>
      | ((prevValue: Record<string, Preference>) => Record<string, Preference>)
  ) => void
] => {
  const [preferenceSettings, setPreferenceSettings] = useLocalStorage<{
    [key: string]: Preference;
  }>('preferenceSettings-v2', defaultPreferenceSettings);

  // Ensure missing keys from defaults are merged in
  useEffect(() => {
    const updatedPreferences = {
      ...defaultPreferenceSettings,
      ...preferenceSettings,
    };

    // Only update if there were missing keys
    if (
      JSON.stringify(updatedPreferences) !== JSON.stringify(preferenceSettings)
    ) {
      setPreferenceSettings(updatedPreferences);
    }
  }, [preferenceSettings, setPreferenceSettings]);

  return [preferenceSettings, setPreferenceSettings];
};

export default usePreferenceSettings;
