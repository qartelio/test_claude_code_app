import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { CandidateShell } from '@/components/layout/CandidateShell';
import { Link } from '@/i18n/navigation';

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'candidate.profile' });
  return { title: t('title') };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'candidate.profile' });
  return (
    <CandidateShell showBottomNav>
      <section className="flex flex-col gap-4 py-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">{t('title')}</h1>
        <p className="text-muted text-sm">{t('empty')}</p>
        <Button asChild>
          <Link href="/candidate/onboarding">{t('startOnboarding')}</Link>
        </Button>
      </section>
    </CandidateShell>
  );
}
