import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ApplicationsList } from '@/components/candidate/ApplicationsList';
import { CandidateShell } from '@/components/layout/CandidateShell';

interface ApplicationsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ApplicationsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'candidate.applications' });
  return { title: t('title') };
}

export default async function ApplicationsPage({ params }: ApplicationsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'candidate.applications' });
  return (
    <CandidateShell showBottomNav>
      <section className="flex flex-col gap-4 py-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">{t('title')}</h1>
        <ApplicationsList />
      </section>
    </CandidateShell>
  );
}
