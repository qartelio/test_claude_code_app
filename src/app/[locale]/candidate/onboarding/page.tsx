import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { OnboardingWizard } from '@/components/candidate/OnboardingWizard';
import { CandidateShell } from '@/components/layout/CandidateShell';

interface OnboardingPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: OnboardingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'candidate.onboarding' });
  return { title: t('title') };
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <CandidateShell>
      <section className="py-6 sm:py-10">
        <OnboardingWizard />
      </section>
    </CandidateShell>
  );
}
