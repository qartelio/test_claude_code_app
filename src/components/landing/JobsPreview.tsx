'use client';

import { useLocale, useTranslations } from 'next-intl';

import { useJobs } from '@/features/jobs/hooks';
import type { SupportedLocale } from '@/features/shared/types';
import { Link } from '@/i18n/navigation';

export function JobsPreview() {
  const t = useTranslations('jobs');
  const tActions = useTranslations('actions');
  const locale = useLocale() as SupportedLocale;
  const { data, isLoading, isError, refetch } = useJobs({ limit: 3 });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="border-border bg-surface-2 h-48 animate-pulse rounded-2xl border"
            role="status"
            aria-label={tActions('loading')}
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        className="border-danger/20 bg-danger/5 flex flex-col items-start gap-2 rounded-2xl border p-5"
        role="alert"
      >
        <p className="text-danger text-sm font-medium">{t('list.empty')}</p>
        <button
          type="button"
          className="text-primary text-sm font-semibold underline-offset-4 hover:underline"
          onClick={() => {
            void refetch();
          }}
        >
          {tActions('retry')}
        </button>
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <div className="border-border bg-surface-2 rounded-2xl border border-dashed p-8 text-center">
        <p className="text-muted text-sm">{t('list.empty')}</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {data.items.map((job) => {
        const title = job.title[locale] ?? job.title.ru;
        return (
          <li key={job.id}>
            <Link
              href={{ pathname: '/jobs/[id]', params: { id: job.id } }}
              className="group border-border bg-surface-2 shadow-card hover:shadow-elevated hover:border-primary/30 flex h-full flex-col gap-3 rounded-2xl border p-5 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="bg-primary-soft text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-semibold">
                  {job.country}
                </div>
                <span className="bg-accent-soft text-verified inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  {t('card.verified')}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-base font-semibold transition-colors">
                  {title}
                </h3>
                <p className="text-muted text-xs">
                  {job.city}, {job.country}
                </p>
              </div>
              <div className="border-border mt-auto flex items-baseline gap-1 border-t pt-3">
                <span className="text-foreground text-lg font-bold">
                  {job.salaryMin.toLocaleString(locale)}–
                  {job.salaryMax.toLocaleString(locale)}
                </span>
                <span className="text-muted text-xs font-medium">
                  {job.currency} {t('card.perMonth')}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
