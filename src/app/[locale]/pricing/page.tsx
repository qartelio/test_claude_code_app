import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CandidateShell } from '@/components/layout/CandidateShell';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

interface PricingPageProps {
  params: Promise<{ locale: string }>;
}

const PLAN_KEYS = ['starter', 'growth', 'scale', 'enterprise'] as const;
type PlanKey = (typeof PLAN_KEYS)[number];

export async function generateMetadata({ params }: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return { title: `${t('title')} — Work Abroad`, description: t('subtitle') };
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pricing' });

  return (
    <CandidateShell>
      <article className="flex flex-col gap-6 py-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold sm:text-4xl">{t('title')}</h1>
          <p className="text-muted max-w-2xl">{t('subtitle')}</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLAN_KEYS.map((plan) => (
            <PlanCard key={plan} plan={plan} cta={t('cta')} />
          ))}
        </section>
      </article>
    </CandidateShell>
  );
}

interface PlanCardProps {
  plan: PlanKey;
  cta: string;
}

async function PlanCard({ plan, cta }: PlanCardProps) {
  const t = await getTranslations(`pricing.plans.${plan}`);
  const features = (await import('next-intl/server')).getTranslations;
  void features;
  return (
    <article className="border-border bg-surface-2 shadow-card flex flex-col gap-3 rounded-md border p-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{t('name')}</h2>
        <p className="text-primary text-xl font-semibold">{t('price')}</p>
        <p className="text-muted text-sm">{t('description')}</p>
      </header>
      <PlanFeatures plan={plan} />
      <div>
        <Button size="sm" variant={plan === 'growth' ? 'primary' : 'secondary'} asChild>
          <Link href="/signup">{cta}</Link>
        </Button>
      </div>
    </article>
  );
}

async function PlanFeatures({ plan }: { plan: PlanKey }) {
  const tRaw = await getTranslations();
  const featuresRaw = tRaw.raw(`pricing.plans.${plan}.features`) as ReadonlyArray<string>;
  return (
    <ul className="text-muted flex flex-col gap-1 text-sm">
      {featuresRaw.map((feature) => (
        <li key={feature}>• {feature}</li>
      ))}
    </ul>
  );
}
