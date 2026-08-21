import { createContext } from "react";
import type {
  AdminUser,
  AuthStatus,
  LoginRequest,
  RegisterRequest,
} from "@/admin/types";

export interface AuthContextValue {
  readonly user: AdminUser | null;
  readonly status: AuthStatus;
  readonly login: (payload: LoginRequest) => Promise<AdminUser>;
  readonly register: (payload: RegisterRequest) => Promise<AdminUser>;
  readonly logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
