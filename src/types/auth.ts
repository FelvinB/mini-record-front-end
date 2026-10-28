import type { Student } from "./student";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  student: Student | null;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  student_number: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ProfilePayload {
  first_name: string;
  last_name: string;
  course: string;
  year_level: number;
}