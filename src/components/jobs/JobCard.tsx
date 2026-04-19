import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { formatSalaryRange, localizeText } from '@/features/jobs/format';
import type { Job } from '@/features/jobs/types';
import type { SupportedLocale } from '@/features/shared/types';
import { Link } from '@/i18n/navigation';

interface JobCardProps {
  job: Job;
  locale: SupportedLocale;
}

export function JobCard({ job, locale }: JobCardProps) {
  const t = useTranslations('jobs.card');
  const tCountry = useTranslations('country');
  const tIndustry = useTranslations('industry');

  const title = localizeText(job.title, locale);
  const salary = formatSalaryRange(job, locale);

  return (
    <article className="border-border bg-surface-2 shadow-card flex flex-col gap-3 rounded-md border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-foreground text-base font-semibold">{title}</h3>
          <p className="text-muted text-sm">
            {job.city}, {tCountry(job.country)} · {tIndustry(job.industry)}
          </p>
        </div>
      </div>
      <p className="text-sm">
        <span className="text-muted">{t('salary')}:</span>{' '}
        <span className="font-medium">{salary}</span>
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-muted text-xs">#{job.id}</span>
        <Button size="sm" asChild>
          <Link href={{ pathname: '/jobs/[id]', params: { id: job.id } }}>{t('apply')}</Link>
        </Button>
      </div>
    </article>
  );
}
