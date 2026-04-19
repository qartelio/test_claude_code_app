import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CandidateShell } from '@/components/layout/CandidateShell';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: `${t('title')} — Work Abroad`, description: t('intro') };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <CandidateShell>
      <article className="flex flex-col gap-6 py-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">{t('title')}</h1>
          <p className="text-muted max-w-2xl">{t('intro')}</p>
        </header>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{t('mission.title')}</h2>
          <p>{t('mission.body')}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{t('values.title')}</h2>
          <ul className="grid gap-2 text-sm sm:grid-cols-3">
            <li className="border-border bg-surface-2 rounded-md border p-3">
              {t('values.safety')}
            </li>
            <li className="border-border bg-surface-2 rounded-md border p-3">
              {t('values.transparency')}
            </li>
            <li className="border-border bg-surface-2 rounded-md border p-3">
              {t('values.respect')}
            </li>
          </ul>
        </section>
      </article>
    </CandidateShell>
  );
}
