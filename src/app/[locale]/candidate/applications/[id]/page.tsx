import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ApplicationDetail } from '@/components/candidate/ApplicationDetail';
import { CandidateShell } from '@/components/layout/CandidateShell';

interface ApplicationDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ApplicationDetailPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'candidate.applications' });
  return { title: t('title') };
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return (
    <CandidateShell showBottomNav>
      <section className="py-6">
        <ApplicationDetail applicationId={id} />
      </section>
    </CandidateShell>
  );
}
