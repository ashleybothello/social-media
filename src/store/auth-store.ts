import { useState, useEffect } from 'react';

const TOKEN_KEY = 'aix_access_token';
const USER_KEY = 'aix_user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export function setAuthData(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [user, setUser] = useState<AuthUser | null>(getAuthUser());

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getAuthToken());
      setUser(getAuthUser());
    };
    
    // We could add an event listener here to sync auth state across tabs
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    isAuthenticated: !!token,
    user,
    token,
    logout: () => {
      clearAuthData();
      setToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  };
}
