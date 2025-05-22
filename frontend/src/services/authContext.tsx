import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import api from './api'; // Import the configured axios instance

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ok: boolean, error?: string}>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<{ok: boolean, error?: string}>;
  fetchMe: () => Promise<void>;
  setUser: (user: User | null) => void;
  isLoading: boolean; // Add isLoading state
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ ok: false }),
  logout: async () => {},
  register: async () => ({ ok: false }),
  fetchMe: async () => {},
  setUser: () => {},
  isLoading: false, // Default to false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true for initial load

  const fetchMe = async () => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      setIsLoading(false); // No session ID, stop loading
      return;
    }

    try {
      // Use the configured axios instance
      const response = await api.get('/auth/me');
      if (response.status === 200) {
        setUser(response.data);
        setSessionId(storedSessionId); // Ensure sessionId state is set
      } else {
        // Handle cases where token is invalid or expired but request is 200 (e.g., specific error payload)
        console.error('Fetch me failed with status 200 but unexpected response:', response);
        setUser(null);
        setSessionId(null);
        localStorage.removeItem('sessionId');
      }
    } catch (error) {
      console.error('Fetch me error:', error);
      setUser(null);
      setSessionId(null);
      localStorage.removeItem('sessionId');
    } finally {
      setIsLoading(false); // Always stop loading after fetch attempt
    }
  };

  useEffect(() => { 
    fetchMe(); // Call fetchMe on mount to check for existing session
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      if (response.status === 200) {
        const data = response.data;
        setUser(data);
        setSessionId(data.sessionId);
        localStorage.setItem('sessionId', data.sessionId);
        return { ok: true };
      } else {
         // This else block might not be reached with axios, check status in try block
         return { ok: false, error: 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Extract error message from response if available
      const errorMessage = error.response?.data?.error || 'An error occurred during login';
      return { ok: false, error: errorMessage };
    }
  };

  const logout = async () => {
    // Use the configured axios instance
    try {
      if (sessionId) {
         await api.post('/auth/logout');
      }
    } catch (error) {
       console.error('Logout error:', error);
    }
    
    setUser(null);
    setSessionId(null);
    localStorage.removeItem('sessionId');
  };

  const register = async (username: string, email: string, password: string) => {
     try {
       const response = await api.post('/auth/register', {
         username,
         email,
         password
       });
       if (response.status === 200) {
         const data = response.data;
         setUser(data);
         setSessionId(data.sessionId);
         localStorage.setItem('sessionId', data.sessionId);
         return { ok: true };
       } else {
          return { ok: false, error: 'Registration failed' };
       }
     } catch (error: any) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.error || 'An error occurred during registration';
        return { ok: false, error: errorMessage };
     }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, fetchMe, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 