'use client';

import { create } from 'zustand';

import type { PipelineStage } from '@/features/pipeline/types';

export interface Notification {
  id: string;
  kind: 'applicationCreated' | 'statusChanged' | 'info';
  applicationId?: string;
  stage?: PipelineStage;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  items: ReadonlyArray<Notification>;
  push: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Notification;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  push: (input) => {
    const n: Notification = {
      ...input,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    set((state) => ({ items: [n, ...state.items].slice(0, 50) }));
    return n;
  },
  markAllRead: () => set((state) => ({ items: state.items.map((i) => ({ ...i, read: true })) })),
  clear: () => set({ items: [] }),
}));

export function unreadCount(state: NotificationState): number {
  return state.items.reduce((count, item) => (item.read ? count : count + 1), 0);
}
