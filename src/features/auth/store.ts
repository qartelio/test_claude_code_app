'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { DEMO_USERS, GUEST_USER, type CurrentUser, type UserRole } from './types';

interface AuthState {
  user: CurrentUser;
  signInAs: (role: Exclude<UserRole, 'guest'>) => void;
  signOut: () => void;
}

const COOKIE_NAME = 'work-abroad-role';
const COOKIE_MAX_AGE_DAYS = 30;

function writeCookie(role: UserRole): void {
  if (typeof document === 'undefined') return;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: GUEST_USER,
      signInAs: (role) => {
        const next = DEMO_USERS[role];
        writeCookie(role);
        set({ user: next });
      },
      signOut: () => {
        writeCookie('guest');
        set({ user: GUEST_USER });
      },
    }),
    {
      name: 'work-abroad-auth-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
