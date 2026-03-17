import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from './types';

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string;
}

interface AuthContextType extends AuthState {
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userRole: 'student',
    userName: 'Ahmed Ben Ali',
  });

  const login = (role: UserRole, name?: string) => {
    setAuth({ isAuthenticated: true, userRole: role, userName: name || 'Ahmed Ben Ali' });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, userRole: 'student', userName: '' });
  };

  const setRole = (role: UserRole) => {
    setAuth(prev => ({ ...prev, userRole: role }));
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
