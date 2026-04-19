import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { ApplyButton } from '@/components/jobs/ApplyButton';
import { CandidateShell } from '@/components/layout/CandidateShell';
import { formatSalaryRange, formatSeason, localizeText } from '@/features/jobs/format';
import type { SupportedLocale } from '@/features/shared/types';
import { Link } from '@/i18n/navigation';
import { db } from '@/mocks/db';

interface JobDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const job = db.jobs.findById(id);
  if (!job) return { title: 'Work Abroad' };
  const title = localizeText(job.title, locale as SupportedLocale);
  return {
    title: `${title} — Work Abroad`,
    description: localizeText(job.description, locale as SupportedLocale),
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const job = db.jobs.findById(id);
  if (!job) notFound();

  const employer = db.employers.findById(job.employerId);
  const t = await getTranslations({ locale, namespace: 'jobs.detail' });
  const tBenefit = await getTranslations({ locale, namespace: 'benefit' });
  const tCountry = await getTranslations({ locale, namespace: 'country' });
  const tIndustry = await getTranslations({ locale, namespace: 'industry' });

  const localeKey = locale as SupportedLocale;
  const title = localizeText(job.title, localeKey);
  const description = localizeText(job.description, localeKey);
  const salary = formatSalaryRange(job, localeKey);
  const season = formatSeason(job, localeKey);

  return (
    <CandidateShell>
      <article className="flex flex-col gap-6 py-6">
        <Link href="/jobs" className="text-primary text-sm">
          {t('backToList')}
        </Link>

        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          <p className="text-muted text-sm">
            {job.city}, {tCountry(job.country)} · {tIndustry(job.industry)}
          </p>
          <p className="text-base font-medium">{salary}</p>
          <p className="text-muted text-sm">{season}</p>
        </header>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t('about')}</h2>
          <p className="text-sm">{description}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{t('requirements')}</h2>
          <ul className="text-sm">
            <li>{t('experienceYears', { years: job.requiredExperienceYears })}</li>
            {job.requiredLanguages.map((l) => (
              <li key={l.lang}>
                {l.lang.toUpperCase()} — {l.level}
              </li>
            ))}
          </ul>
        </section>

        {job.benefits.length > 0 && (
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{t('benefits')}</h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {job.benefits.map((b) => (
                <li key={b} className="border-border bg-surface-2 rounded-md border px-2 py-1">
                  {tBenefit(b)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {employer && (
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{t('employer')}</h2>
            <p className="text-sm">
              {employer.name} ({employer.legalName})
            </p>
          </section>
        )}

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="text-muted">
            {t('applicationsCount', { count: job.applicationsCount })}
          </span>
          <span className="text-muted">{t('quota', { quota: job.quota })}</span>
        </div>

        <ApplyButton jobId={job.id} />
      </article>
    </CandidateShell>
  );
}
