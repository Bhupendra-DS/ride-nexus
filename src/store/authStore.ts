import { create } from 'zustand';

export type UserRole = 'user' | 'owner' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  /** True after Firebase auth has resolved at least once (success or signed out). */
  initialized: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

/**
 * In-memory only — Firebase Auth is the source of truth for sessions.
 * Persisting user/role here caused stale "logged in" UI when Firebase had already signed out.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  initialized: false,
  login: (user) => set({ user, isLoggedIn: true, initialized: true }),
  logout: () => set({ user: null, isLoggedIn: false, initialized: true }),
}));
