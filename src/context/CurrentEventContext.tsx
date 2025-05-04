import React, { createContext, useContext, useState } from 'react';

export interface FireDBEventInfo {
  value: string;
  id: string;
}

interface CurrentEventContextType {
  eventId: string | null;
  setEventId: (id: string) => void;
}

const LOCAL_STORAGE_KEY = 'currentEventId';

const CurrentEventContext = createContext<CurrentEventContextType | undefined>(
  undefined
);

export const CurrentEventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [eventId, setEventIdState] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  });

  const setEventId = (id: string) => {
    setEventIdState(id);
    localStorage.setItem(LOCAL_STORAGE_KEY, id);
  };

  return (
    <CurrentEventContext.Provider value={{ eventId, setEventId }}>
      {children}
    </CurrentEventContext.Provider>
  );
};

export const useCurrentEvent = (): CurrentEventContextType => {
  const context = useContext(CurrentEventContext);
  if (!context) {
    throw new Error(
      'useCurrentEvent must be used within a CurrentEventProvider'
    );
  }
  return context;
};
