'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSyncExternalStore } from 'react';

import { useAuthStore } from '@/features/auth/store';
import { DEMO_USERS } from '@/features/auth/types';
import { formatDateTime } from '@/features/shared/format';
import { localizeText } from '@/features/jobs/format';
import type { SupportedLocale } from '@/features/shared/types';
import { Link } from '@/i18n/navigation';
import { db } from '@/mocks/db';

import { ApplicationStatusTimeline } from './ApplicationStatusTimeline';
import { AudioInstruction } from './AudioInstruction';

interface ApplicationDetailProps {
  applicationId: string;
}

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function useClientNow(): number | null {
  return useSyncExternalStore(
    () => () => {},
    () => Date.now(),
    () => null,
  );
}

function useHoursUntil(iso: string | null): number | null {
  const now = useClientNow();
  if (!iso || now === null) return null;
  return Math.max(0, Math.round((new Date(iso).getTime() - now) / 3_600_000));
}

export function ApplicationDetail({ applicationId }: ApplicationDetailProps) {
  const isMounted = useIsMounted();
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations('candidate.applications');
  const tDetail = useTranslations('candidate.applications.detail');
  const tStage = useTranslations('candidate.pipeline');
  const currentUser = useAuthStore((s) => s.user);
  const app = isMounted ? db.applications.findById(applicationId) : null;
  const hoursLeft = useHoursUntil(app?.slaDueAt ?? null);

  if (!isMounted) return null;

  const candidateId =
    currentUser.role === 'candidate' ? currentUser.id : DEMO_USERS.candidate.id;

  if (!app || app.candidateId !== candidateId) {
    return <p className="text-muted text-sm">{t('empty')}</p>;
  }
  const job = db.jobs.findById(app.jobId);
  const title = job ? localizeText(job.title, locale) : app.jobId;

  return (
    <article className="flex flex-col gap-5">
      <Link
        href="/candidate/applications"
        className="text-muted hover:text-foreground text-sm"
      >
        {t('back')}
      </Link>

      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted text-xs">
          {t('submittedAt', { date: formatDateTime(app.createdAt, locale) })}
        </p>
      </header>

      <section aria-labelledby="status-heading" className="flex flex-col gap-3">
        <h2 id="status-heading" className="text-foreground text-lg font-semibold">
          {tDetail('status')}
        </h2>
        <div className="rounded-md bg-[color:var(--color-primary)] p-4 text-white">
          <p className="text-lg font-semibold">{tStage(app.status)}</p>
          {hoursLeft !== null ? (
            <p className="text-xs opacity-90">{tDetail('sla', { hours: hoursLeft })}</p>
          ) : null}
        </div>
        <AudioInstruction audioKey={`status-${app.status}`} text={tStage(app.status)} />
        <ApplicationStatusTimeline current={app.status} />
      </section>

      <section aria-labelledby="history-heading" className="flex flex-col gap-3">
        <h2 id="history-heading" className="text-foreground text-lg font-semibold">
          {tDetail('history')}
        </h2>
        <ul className="flex flex-col gap-2">
          {app.history.map((h, index) => (
            <li
              key={`${h.at}-${index}`}
              className="border-border bg-surface-2 flex flex-col gap-0.5 rounded-md border p-3 text-sm"
            >
              <span className="text-foreground font-medium">{tStage(h.to)}</span>
              <span className="text-muted text-xs">{formatDateTime(h.at, locale)}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
