import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const demoUsers: Record<string, AuthUser> = {
  admin: {
    id: 'admin-001',
    name: 'Alex Rivera',
    email: 'admin@ridenexus.com',
    role: 'admin',
  },
  owner: {
    id: 'owner-001',
    name: 'James Carter',
    email: 'owner@ridenexus.com',
    role: 'owner',
  },
  user: {
    id: 'user-001',
    name: 'Sarah Chen',
    email: 'user@ridenexus.com',
    role: 'user',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'ridenexus-auth',
    }
  )
);
