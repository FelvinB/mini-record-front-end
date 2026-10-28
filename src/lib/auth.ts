import { createContext, useContext } from "react";
import { api } from "@/lib/api";
import type {
  AuthSession,
  AuthUser,
  ProfilePayload,
  RegisterPayload,
} from "@/types/auth";
import type { Student } from "@/types/student";

export function loginRequest(email: string, password: string) {
  return api.post<AuthSession>("/login", { email, password });
}

export function registerRequest(payload: RegisterPayload) {
  return api.post<AuthSession>("/register", payload);
}

export function fetchMe() {
  return api.get<{ user: AuthUser }>("/me");
}

export function logoutRequest() {
  return api.post<{ message: string }>("/logout", {});
}

export function fetchMyStudent() {
  return api.get<{ data: Student }>("/me/student");
}

export function updateMyStudent(payload: ProfilePayload) {
  return api.put<{ data: Student }>("/me/student", payload);
}

export interface AuthContextValue {
  user: AuthUser | null;
  signIn: (session: AuthSession) => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}