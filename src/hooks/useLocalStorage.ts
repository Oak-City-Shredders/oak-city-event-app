import { useState, useEffect, useCallback } from 'react';

const localStorageEventTarget = new EventTarget(); // Global event bus

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Dispatch event to notify other components
        localStorageEventTarget.dispatchEvent(
          new CustomEvent('localStorageUpdated', {
            detail: { key, value: valueToStore },
          })
        );
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };

    localStorageEventTarget.addEventListener(
      'localStorageUpdated',
      handleUpdate
    );
    return () => {
      localStorageEventTarget.removeEventListener(
        'localStorageUpdated',
        handleUpdate
      );
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
