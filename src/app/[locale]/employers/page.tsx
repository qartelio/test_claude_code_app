import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CandidateShell } from '@/components/layout/CandidateShell';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

interface EmployersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: EmployersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'employers.hero' });
  return { title: `${t('title')} — Work Abroad`, description: t('subtitle') };
}

export default async function EmployersPage({ params }: EmployersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHero = await getTranslations({ locale, namespace: 'employers.hero' });
  const tBenefits = await getTranslations({ locale, namespace: 'employers.benefits' });

  return (
    <CandidateShell>
      <article className="flex flex-col gap-8 py-8">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold sm:text-4xl">{tHero('title')}</h1>
          <p className="text-muted max-w-2xl">{tHero('subtitle')}</p>
          <div>
            <Button size="lg" asChild>
              <Link href="/signup">{tHero('cta')}</Link>
            </Button>
          </div>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">{tBenefits('title')}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <BenefitCard title={tBenefits('speed.title')} body={tBenefits('speed.body')} />
            <BenefitCard
              title={tBenefits('compliance.title')}
              body={tBenefits('compliance.body')}
            />
            <BenefitCard title={tBenefits('tools.title')} body={tBenefits('tools.body')} />
          </div>
        </section>
      </article>
    </CandidateShell>
  );
}

interface BenefitCardProps {
  title: string;
  body: string;
}

function BenefitCard({ title, body }: BenefitCardProps) {
  return (
    <article className="border-border bg-surface-2 shadow-card rounded-md border p-4">
      <h3 className="text-primary text-base font-semibold">{title}</h3>
      <p className="text-muted mt-2 text-sm">{body}</p>
    </article>
  );
}
