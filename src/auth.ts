// src/auth.ts
import { getAuth } from "firebase/auth";
import app from "./firebase";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";


getAuth(app);

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await FirebaseAuthentication.createUserWithEmailAndPassword({email, password});
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Signing in..")
    debugger;
    const userCredential = await FirebaseAuthentication.signInWithEmailAndPassword({email, password});
    console.log("returned with user:" + userCredential)
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
    try {
      await FirebaseAuthentication.sendPasswordResetEmail({email});
    } catch (error) {
      console.error("Error Resetting Password:", error);
      throw error;
    }
    };

export const logoutUser = async () => {
  try {
    await FirebaseAuthentication.signOut();
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
