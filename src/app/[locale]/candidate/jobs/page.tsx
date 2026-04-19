import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { JobCard } from '@/components/jobs/JobCard';
import { CandidateShell } from '@/components/layout/CandidateShell';
import type { SupportedLocale } from '@/features/shared/types';
import { db } from '@/mocks/db';

interface CandidateJobsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CandidateJobsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'candidate.feed' });
  return { title: t('title') };
}

export default async function CandidateJobsPage({ params }: CandidateJobsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'candidate.feed' });

  const { items } = db.jobs.list({ limit: 12 });

  return (
    <CandidateShell showBottomNav>
      <section className="flex flex-col gap-4 py-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold sm:text-3xl">{t('title')}</h1>
          <p className="text-muted text-sm">{t('subtitle')}</p>
        </header>
        {items.length === 0 ? (
          <p className="text-muted text-sm">{t('empty')}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((job) => (
              <li key={job.id}>
                <JobCard job={job} locale={locale as SupportedLocale} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </CandidateShell>
  );
}
