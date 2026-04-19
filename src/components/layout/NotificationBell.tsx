'use client';

import { useTranslations } from 'next-intl';
import { useState, useSyncExternalStore } from 'react';

import { useNotificationStore } from '@/features/notifications/store';

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function NotificationBell() {
  const t = useTranslations('notifications');
  const isMounted = useIsMounted();
  const items = useNotificationStore((s) => s.items);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const clear = useNotificationStore((s) => s.clear);
  const [open, setOpen] = useState(false);

  if (!isMounted) {
    return (
      <button
        type="button"
        aria-label={t('title')}
        className="border-border bg-surface text-muted inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm"
        disabled
      >
        <BellGlyph />
      </button>
    );
  }

  const unread = items.reduce((count, item) => (item.read ? count : count + 1), 0);

  function onToggle() {
    setOpen((prev) => {
      const next = !prev;
      if (next && unread > 0) markAllRead();
      return next;
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t('title')}
        aria-expanded={open}
        onClick={onToggle}
        className="border-border bg-surface hover:text-foreground relative inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm"
      >
        <BellGlyph />
        {unread > 0 ? (
          <span className="bg-primary absolute -top-1 -right-1 inline-flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-medium text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="border-border bg-surface absolute right-0 z-40 mt-2 flex w-72 flex-col gap-2 rounded-md border p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{t('title')}</span>
            <button
              type="button"
              onClick={clear}
              className="text-muted hover:text-foreground text-xs"
            >
              {t('clear')}
            </button>
          </div>
          {items.length === 0 ? (
            <p className="text-muted text-xs">{t('noNotifications')}</p>
          ) : (
            <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto">
              {items.slice(0, 10).map((n) => (
                <li key={n.id} className="border-border rounded-md border p-2 text-xs">
                  <NotificationRow kind={n.kind} stage={n.stage} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function BellGlyph() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

interface NotificationRowProps {
  kind: 'applicationCreated' | 'statusChanged' | 'info';
  stage?: string;
}

function NotificationRow({ kind, stage }: NotificationRowProps) {
  const t = useTranslations('notifications');
  if (kind === 'applicationCreated') return <span>{t('applicationCreated')}</span>;
  if (kind === 'statusChanged') return <span>{t('statusChanged', { status: stage ?? '—' })}</span>;
  return <span>—</span>;
}
