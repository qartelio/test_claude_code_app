'use client';

import { useLocale, useTranslations } from 'next-intl';

import { useJobs } from '@/features/jobs/hooks';
import type { SupportedLocale } from '@/features/shared/types';

export function JobsPreview() {
  const t = useTranslations('jobs');
  const tActions = useTranslations('actions');
  const locale = useLocale() as SupportedLocale;
  const { data, isLoading, isError, refetch } = useJobs({ limit: 3 });

  if (isLoading) {
    return (
      <p className="text-muted text-sm" role="status">
        {tActions('loading')}
      </p>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-start gap-2" role="alert">
        <p className="text-danger text-sm">{t('list.empty')}</p>
        <button
          type="button"
          className="text-sm underline"
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
    return <p className="text-muted text-sm">{t('list.empty')}</p>;
  }

  return (
    <ul className="grid gap-3">
      {data.items.map((job) => {
        const title = job.title[locale] ?? job.title.ru;
        return (
          <li key={job.id} className="border-border bg-surface-2 shadow-card rounded-md border p-4">
            <h3 className="text-foreground text-base font-semibold">{title}</h3>
            <p className="text-muted mt-1 text-sm">
              {job.city}, {job.country}
            </p>
            <p className="mt-2 text-sm">
              {t('card.salary')}: {job.salaryMin.toLocaleString(locale)}–
              {job.salaryMax.toLocaleString(locale)} {job.currency}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
