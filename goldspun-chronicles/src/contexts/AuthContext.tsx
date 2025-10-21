import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Use backend JWT auth instead of localStorage mock
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const apiUrl = (p: string) => `${API_BASE}/api${p}`;

export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, username: string) => Promise<{ error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate session from backend using stored JWT
    const token = localStorage.getItem('token');
    if (!token) {
      // Clear any mock artifacts
      localStorage.removeItem('users');
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        const resp = await fetch(apiUrl('/auth/me'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await resp.json();
        if (resp.ok && data?.ok && data?.user) {
          const u = data.user as User;
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        } else {
          // Invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch {
        // Network or server error — keep logged out
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const resp = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok || !data?.ok) {
        return { error: data?.error || 'Invalid email or password' };
      }
      const token: string = data.token;
      const u: User = data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
      return {};
    } catch (e) {
      return { error: 'Network error. Please try again.' };
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      const resp = await fetch(apiUrl('/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await resp.json();
      if (!resp.ok || !data?.ok) {
        return { error: data?.error || 'Signup failed' };
      }
      const token: string = data.token;
      const u: User = data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
      return {};
    } catch (e) {
      return { error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
