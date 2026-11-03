'use client';

import { useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  mobile?: string;
  phone?: string;
  email?: string | null;
  role?: string;
  isVerified?: boolean;
}

const AUTH_STORAGE_KEY = 'agri_auth_user';

export function getClientAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem('agrimart_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        parsed.mobile = parsed.mobile || parsed.phone || '';
        parsed.phone = parsed.phone || parsed.mobile || '';
      }
      return parsed;
    }

    // Check cookie fallback
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, val] = cookie.trim().split('=');
      if (name === AUTH_STORAGE_KEY && val) {
        const parsed = JSON.parse(decodeURIComponent(val));
        if (parsed) {
          parsed.mobile = parsed.mobile || parsed.phone || '';
          parsed.phone = parsed.phone || parsed.mobile || '';
        }
        return parsed;
      }
    }
  } catch (err) {
    // Ignore parse error
  }
  return null;
}

export function setClientAuthUser(user: AuthUser) {
  if (typeof window === 'undefined') return;
  try {
    const normalizedUser = {
      ...user,
      mobile: user.mobile || user.phone || '',
      phone: user.phone || user.mobile || '',
    };
    const jsonStr = JSON.stringify(normalizedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, jsonStr);
    localStorage.setItem('agrimart_user', jsonStr);

    // Set cookie for 30 days
    document.cookie = `${AUTH_STORAGE_KEY}=${encodeURIComponent(jsonStr)}; path=/; max-age=2592000; SameSite=Lax`;

    window.dispatchEvent(new Event('agri_auth_change'));
  } catch (err) {
    console.error('Error saving auth user:', err);
  }
}

export function clearClientAuthUser() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('agrimart_user');
    document.cookie = `${AUTH_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    window.dispatchEvent(new Event('agri_auth_change'));
  } catch (err) {
    console.error('Error clearing auth user:', err);
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getClientAuthUser());
    setIsLoading(false);

    const handleAuthChange = () => {
      setUser(getClientAuthUser());
    };

    window.addEventListener('agri_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('agri_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    login: setClientAuthUser,
    logout: clearClientAuthUser,
  };
}
