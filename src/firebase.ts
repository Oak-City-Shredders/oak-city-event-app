import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA9aeJTaNMCOhu1PTTJGXNDgbT6ibYrB6w',
  authDomain: 'project3-449305.firebaseapp.com',
  projectId: 'project3-449305',
  storageBucket: 'project3-449305.firebasestorage.app',
  messagingSenderId: '604117514059',
  appId: '1:604117514059:web:9a8626b8c4ba54c7d39ace',
  measurementId: 'G-8CWCF62FDF',
};

// Define types for our Firebase services
interface FirebaseServices {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  analytics: Analytics | null;
}

// Initialize Firebase based on platform
const initializeFirebase = (): FirebaseServices => {
  let app: FirebaseApp | null = null;

  // For web platform
  if (!Capacitor.isNativePlatform()) {
    try {
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }

      const auth = getAuth(app);
      const db = getFirestore(app);
      const analytics = getAnalytics(app);

      return { app, auth, db, analytics };
    } catch (error) {
      console.error('Error initializing Firebase for web:', error);
      return { app: null, auth: null, db: null, analytics: null };
    }
  }

  // For native platform
  // You could initialize Firebase differently for native if needed
  // For now, return null services
  return { app: null, auth: null, db: null, analytics: null };
};

// Export Firebase services
export const firebase = initializeFirebase();
export const app = firebase.app;
export const auth = firebase.auth;
export const db = firebase.db;
export const analytics = firebase.analytics;

// Helper function to check if Firebase is initialized
export const isFirebaseInitialized = (): boolean => {
  return !!firebase.app;
};
