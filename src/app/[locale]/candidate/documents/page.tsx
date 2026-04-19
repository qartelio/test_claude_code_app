import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CandidateShell } from '@/components/layout/CandidateShell';

interface DocumentsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DocumentsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'candidate.documents' });
  return { title: t('title') };
}

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'candidate.documents' });
  return (
    <CandidateShell showBottomNav>
      <section className="flex flex-col gap-4 py-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">{t('title')}</h1>
        <p className="text-muted text-sm">{t('empty')}</p>
      </section>
    </CandidateShell>
  );
}
