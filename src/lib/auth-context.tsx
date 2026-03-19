import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserRole } from "./types";

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  token: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUpStudent: (payload: { email: string; password: string; name: string }) => Promise<void>;
  signUpOrganization: (payload: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storageKeys = {
  token: "auth_token",
  email: "auth_email",
  name: "auth_name",
  role: "auth_role",
} as const;

function roleFromServer(role?: string): UserRole {
  const r = (role || "").toUpperCase();
  if (r === "ADMIN") return "admin";
  if (r === "ORGANISATION") return "organization";
  if (r === "INDIVIDU") return "student";
  return "student";
}

function setStoredAuth(next: Pick<AuthState, "token" | "userEmail" | "userName" | "userRole">) {
  if (next.token) localStorage.setItem(storageKeys.token, next.token);
  localStorage.setItem(storageKeys.email, next.userEmail);
  localStorage.setItem(storageKeys.name, next.userName);
  localStorage.setItem(storageKeys.role, next.userRole);
}

function clearStoredAuth() {
  localStorage.removeItem(storageKeys.token);
  localStorage.removeItem(storageKeys.email);
  localStorage.removeItem(storageKeys.name);
  localStorage.removeItem(storageKeys.role);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    userRole: "student",
    userName: "",
    userEmail: "",
    token: null,
  });

  // Load auth state from localStorage once.
  useEffect(() => {
    const token = localStorage.getItem(storageKeys.token);
    const userEmail = localStorage.getItem(storageKeys.email) || "";
    const userName = localStorage.getItem(storageKeys.name) || "";
    const role = localStorage.getItem(storageKeys.role) as UserRole | null;

    if (token) {
      setAuth({
        isAuthenticated: true,
        token,
        userEmail,
        userName,
        userRole: role || "student",
      });
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const loginRes = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      throw new Error("Login failed");
    }

    const loginJson: { token: string } = await loginRes.json();

    // Fetch user details (role/name) from backend.
    const userRes = await fetch(`/auth/users/${encodeURIComponent(email)}`, {
      method: "GET",
    });
    if (!userRes.ok) {
      throw new Error("Failed to load user details");
    }

    const userJson: { id: number; email: string; name: string; role: string } = await userRes.json();

    const mappedRole = roleFromServer(userJson.role);

    setStoredAuth({
      token: loginJson.token,
      userEmail: userJson.email,
      userName: userJson.name,
      userRole: mappedRole,
    });

    setAuth({
      isAuthenticated: true,
      token: loginJson.token,
      userEmail: userJson.email,
      userName: userJson.name,
      userRole: mappedRole,
    });
  };

  const signUpStudent = async (payload: { email: string; password: string; name: string }) => {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: "INDIVIDU",
      }),
    });
    if (!res.ok) throw new Error("Signup failed");

    // After register, login so the rest of the app can access /projets endpoints.
    await signIn(payload.email, payload.password);
  };

  const signUpOrganization = async (payload: { email: string; password: string; name: string }) => {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: "ORGANISATION",
      }),
    });
    if (!res.ok) throw new Error("Signup failed");

    await signIn(payload.email, payload.password);
  };

  const logout = () => {
    clearStoredAuth();
    setAuth({
      isAuthenticated: false,
      userRole: "student",
      userName: "",
      userEmail: "",
      token: null,
    });
  };

  const value = { ...auth, signIn, signUpStudent, signUpOrganization, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
