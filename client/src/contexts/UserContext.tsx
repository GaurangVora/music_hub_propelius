import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount } from '../types';
import { authService, AuthResponse } from '../services/authService';

interface UserContextType {
  currentUser: UserAccount | null;
  accessToken: string | null;
  signIn: (emailAddress: string, secretKey: string) => Promise<void>;
  signUp: (displayName: string, emailAddress: string, secretKey: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedToken = localStorage.getItem('accessToken');
        
        if (storedToken) {
          setAccessToken(storedToken);
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            setCurrentUser({
              id: payload.userId,
              displayName: payload.displayName,
              emailAddress: payload.emailAddress || ''
            });
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            localStorage.removeItem('accessToken');
          }
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  const signIn = async (emailAddress: string, secretKey: string) => {
    try {
      const response: AuthResponse = await authService.signIn({ emailAddress, secretKey });
      
      setAccessToken(response.accessToken);
      setCurrentUser(response.userAccount);
      
      localStorage.setItem('accessToken', response.accessToken);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (displayName: string, emailAddress: string, secretKey: string) => {
    try {
      const response: AuthResponse = await authService.signUp({ displayName, emailAddress, secretKey });
      
      setAccessToken(response.accessToken);
      setCurrentUser(response.userAccount);
      
      localStorage.setItem('accessToken', response.accessToken);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = () => {
    setAccessToken(null);
    setCurrentUser(null);
    localStorage.removeItem('accessToken');
  };

  const value: UserContextType = {
    currentUser,
    accessToken,
    signIn,
    signUp,
    signOut,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 