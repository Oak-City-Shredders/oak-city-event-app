// src/auth.ts
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential =
      await FirebaseAuthentication.createUserWithEmailAndPassword({
        email,
        password,
      });
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log('Signing in..');
    const userCredential =
      await FirebaseAuthentication.signInWithEmailAndPassword({
        email,
        password,
      });
    console.log('returned with user:' + userCredential);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await FirebaseAuthentication.sendPasswordResetEmail({ email });
  } catch (error) {
    console.error('Error Resetting Password:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await FirebaseAuthentication.signOut();
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export const sendEmailVerification = async () => {
  try {
    await FirebaseAuthentication.sendEmailVerification({
      actionCodeSettings: {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: 'https://rideoakcity.com/tickets',
        // This must be true.
        handleCodeInApp: true,
        iOS: {
          bundleId: 'com.oakcityshredfest.app',
        },
        android: {
          packageName: 'com.oakcityshredfest.app',
          installApp: true,
          minimumVersion: '1',
        },
      },
    });
    console.log('send email verification');
  } catch (error) {
    console.error('Error sending email verificaiton:', error);
  }
};
