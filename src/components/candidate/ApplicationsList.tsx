'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSyncExternalStore } from 'react';

import type { Application } from '@/features/applications/types';
import { useAuthStore } from '@/features/auth/store';
import { DEMO_USERS } from '@/features/auth/types';
import { formatDateTime } from '@/features/shared/format';
import type { SupportedLocale } from '@/features/shared/types';
import { Link } from '@/i18n/navigation';
import { db } from '@/mocks/db';

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ApplicationsList() {
  const isMounted = useIsMounted();
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations('candidate.applications');
  const tStage = useTranslations('candidate.pipeline');
  const currentUser = useAuthStore((s) => s.user);

  if (!isMounted) return null;

  const candidateId =
    currentUser.role === 'candidate' ? currentUser.id : DEMO_USERS.candidate.id;
  const { items } = db.applications.list({ candidateId });

  if (items.length === 0) {
    return <p className="text-muted text-sm">{t('empty')}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((app) => (
        <li key={app.id}>
          <ApplicationRow app={app} locale={locale} />
        </li>
      ))}
    </ul>
  );

  function ApplicationRow({ app, locale }: { app: Application; locale: SupportedLocale }) {
    const job = db.jobs.findById(app.jobId);
    const title = job?.title[locale] ?? job?.title.ru ?? app.jobId;
    return (
      <Link
        href={{ pathname: '/candidate/applications/[id]', params: { id: app.id } }}
        className="border-border bg-surface-2 shadow-card hover:border-[color:var(--color-primary)] flex flex-col gap-2 rounded-md border p-4 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-foreground font-medium">{title}</span>
          <span className="rounded-full bg-[color:var(--color-primary)] px-2 py-0.5 text-xs text-white">
            {tStage(app.status)}
          </span>
        </div>
        <span className="text-muted text-xs">
          {t('updatedAt', { date: formatDateTime(app.updatedAt, locale) })}
        </span>
      </Link>
    );
  }
}
