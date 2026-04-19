'use client';

import { useSyncExternalStore } from 'react';

import { useAuthStore } from '@/features/auth/store';
import { GUEST_USER, type CurrentUser } from '@/features/auth/types';

function subscribe(listener: () => void): () => void {
  return useAuthStore.subscribe(listener);
}

function getServerSnapshot(): CurrentUser {
  return GUEST_USER;
}

export function useCurrentUser(): {
  user: CurrentUser;
  isReady: boolean;
} {
  const user = useSyncExternalStore(
    subscribe,
    () => useAuthStore.getState().user,
    getServerSnapshot,
  );
  const isReady = user !== GUEST_USER || typeof window !== 'undefined';
  return { user, isReady };
}
