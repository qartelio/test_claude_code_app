import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CandidateShell } from '@/components/layout/CandidateShell';

interface TrustPageProps {
  params: Promise<{ locale: string }>;
}

const STEPS = ['1', '2', '3', '4', '5', '6'] as const;

export async function generateMetadata({ params }: TrustPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'trust' });
  return { title: `${t('title')} — Work Abroad`, description: t('intro') };
}

export default async function TrustPage({ params }: TrustPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'trust' });

  return (
    <CandidateShell>
      <article className="flex flex-col gap-6 py-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold sm:text-4xl">{t('title')}</h1>
          <p className="text-muted max-w-2xl">{t('intro')}</p>
        </header>

        <ol className="flex flex-col gap-3">
          {STEPS.map((step, index) => (
            <li key={step} className="border-border bg-surface-2 flex gap-3 rounded-md border p-4">
              <span className="text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current text-sm font-semibold">
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold">{t(`steps.${step}.title`)}</h2>
                <p className="text-muted text-sm">{t(`steps.${step}.body`)}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-primary-dark bg-verified/10 border-verified/40 rounded-md border p-4 text-sm font-medium">
          {t('pledge')}
        </p>
      </article>
    </CandidateShell>
  );
}
