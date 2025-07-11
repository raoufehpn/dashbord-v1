
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the User type locally to remove the dependency on @supabase/supabase-js
interface User {
  id: string;
  app_metadata: { [key: string]: any };
  user_metadata: { [key: string]: any };
  aud: string;
  created_at: string;
  email?: string;
}

// Mock user for preview mode
const previewUser: User = {
  id: 'preview-user-id',
  app_metadata: { provider: 'email' },
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'admin@taskpilot.app'
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch the user session here.
    // For preview mode, we'll just set the mock user.
    setUser(previewUser);
    setLoading(false);
  }, []);


  const logIn = async (email: string, pass: string) => {
    // This is a mock function for preview mode
    console.log("Mock login attempt for:", email);
  }

  const signUp = async (email: string, pass: string) => {
    // This is a mock function for preview mode
    console.log("Mock signup attempt for:", email);
  }

  const logOut = async () => {
    // This is a mock function for preview mode
    console.log("Mock logout");
  }

  return (
    <AuthContext.Provider value={{ user, loading, logIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
