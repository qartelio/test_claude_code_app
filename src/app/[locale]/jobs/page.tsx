import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { JobCard } from '@/components/jobs/JobCard';
import { JobsFilters } from '@/components/jobs/JobsFilters';
import { JobsPagination } from '@/components/jobs/JobsPagination';
import { CandidateShell } from '@/components/layout/CandidateShell';
import type { Country, Industry, SupportedLocale } from '@/features/shared/types';
import { db } from '@/mocks/db';

const VALID_COUNTRIES: ReadonlyArray<Country> = ['TR', 'UK', 'KR', 'PL', 'DE', 'NL'];
const VALID_INDUSTRIES: ReadonlyArray<Industry> = [
  'hospitality',
  'agriculture',
  'manufacturing',
  'construction',
];
const PAGE_SIZE = 12;

interface JobsListPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: JobsListPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'jobs.list' });
  return {
    title: `${t('title')} — Work Abroad`,
    description: t('title'),
  };
}

function parseCountry(raw: string | string[] | undefined): Country | null {
  if (typeof raw !== 'string') return null;
  return (VALID_COUNTRIES as ReadonlyArray<string>).includes(raw) ? (raw as Country) : null;
}

function parseIndustry(raw: string | string[] | undefined): Industry | null {
  if (typeof raw !== 'string') return null;
  return (VALID_INDUSTRIES as ReadonlyArray<string>).includes(raw) ? (raw as Industry) : null;
}

function parseNumber(raw: string | string[] | undefined): number | null {
  if (typeof raw !== 'string') return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default async function JobsListPage({ params, searchParams }: JobsListPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const country = parseCountry(sp.country);
  const industry = parseIndustry(sp.industry);
  const salaryMin = parseNumber(sp.salaryMin);
  const page = parseNumber(sp.page) ?? 1;

  const { items, total } = db.jobs.list({
    country: country ?? undefined,
    industry: industry ?? undefined,
    salaryMin: salaryMin ?? undefined,
    page,
    limit: PAGE_SIZE,
  });

  const t = await getTranslations({ locale, namespace: 'jobs.list' });

  return (
    <CandidateShell>
      <section className="flex flex-col gap-4 py-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold sm:text-3xl">{t('title')}</h1>
          <p className="text-muted text-sm">{t('resultsCount', { count: total })}</p>
        </header>

        <JobsFilters current={{ country, industry, salaryMin }} />

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

        <JobsPagination
          page={page}
          total={total}
          limit={PAGE_SIZE}
          query={{
            country: country ?? undefined,
            industry: industry ?? undefined,
            salaryMin: salaryMin != null ? String(salaryMin) : undefined,
          }}
        />
      </section>
    </CandidateShell>
  );
}
