// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA9aeJTaNMCOhu1PTTJGXNDgbT6ibYrB6w',
  authDomain: 'project3-449305.firebaseapp.com',
  projectId: 'project3-449305',
  storageBucket: 'project3-449305.firebasestorage.app',
  messagingSenderId: '604117514059',
  appId: '1:604117514059:web:9a8626b8c4ba54c7d39ace',
  measurementId: 'G-8CWCF62FDF',
};

let firebaseApp: FirebaseApp | undefined;

// Initialize Firebase only for Web
if (!Capacitor.isNativePlatform()) {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0]; // Use existing app
  }
}

export { firebaseApp };
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const analytics = firebaseApp ? getAnalytics(firebaseApp) : null;
