import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

// Global error handler for uncaught exceptions
window.onerror = (
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
) => {
  console.error('Global error:', message, source, lineno, colno, error);
  void FirebaseAnalytics.logEvent({
    name: 'global_error',
    params: {
      message: message.toString(),
      source: source || 'Unknown',
      lineno: lineno?.toString() || 'Unknown',
      colno: colno?.toString() || 'Unknown',
      stack: error?.stack || 'No stack',
      timestamp: new Date().toISOString(),
    },
  });
};

// Global handler for unhandled promise rejections
window.onunhandledrejection = (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);
  void FirebaseAnalytics.logEvent({
    name: 'promise_error',
    params: {
      message: event.reason?.message || 'Unknown',
      stack: event.reason?.stack || 'No stack',
      timestamp: new Date().toISOString(),
    },
  });
};

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
