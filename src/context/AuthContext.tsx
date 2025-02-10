import React, { createContext, useContext, useEffect, useState } from "react";
import { FirebaseAuthentication, User } from "@capacitor-firebase/authentication";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = FirebaseAuthentication.addListener("authStateChange", (state) => {
      setUser(state.user ?? null);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => {
        FirebaseAuthentication.removeAllListeners();
    }
  }, []);

  // Sign out function
  const signOut = async () => {
    await FirebaseAuthentication.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
