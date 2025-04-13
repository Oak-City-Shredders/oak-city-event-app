// hooks/useFlagsmith.ts
import { useEffect, useState } from 'react';
import flagsmith from 'flagsmith';
const FLAGSMITH_ENVIRONMENT_KEY = import.meta.env
  .VITE_REACT_APP_FLAGSMITH_ENVIRONMENT_KEY;

export const useFlagsmith = () => {
  const [ready, setReady] = useState(false);
  const [features, setFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    flagsmith.init({
      environmentID: FLAGSMITH_ENVIRONMENT_KEY,
      onChange: () => {
        const allFlags = flagsmith.getAllFlags();
        const mapped = Object.fromEntries(
          Object.entries(allFlags).map(([key, flag]) => [key, flag.enabled])
        );
        setFeatures(mapped);
        setReady(true);
      },
    });
  }, []);

  const isEnabled = (feature: string) => features[feature] ?? false;

  return { ready, isEnabled, features };
};
