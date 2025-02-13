// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
