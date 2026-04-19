import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { JobsPreview } from '@/components/landing/JobsPreview';
import { CandidateShell } from '@/components/layout/CandidateShell';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LandingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LandingContent />;
}

function LandingContent() {
  const tLanding = useTranslations('landing');
  const tJobs = useTranslations('jobs');

  return (
    <CandidateShell>
      <section className="flex flex-col gap-10 py-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold sm:text-4xl">{tLanding('hero.title')}</h1>
          <p className="text-muted max-w-2xl text-base">{tLanding('hero.subtitle')}</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/jobs">{tLanding('hero.ctaCandidate')}</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/employers">{tLanding('hero.ctaEmployer')}</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <UspCard title={tLanding('usp.safety.title')} body={tLanding('usp.safety.body')} />
          <UspCard
            title={tLanding('usp.transparency.title')}
            body={tLanding('usp.transparency.body')}
          />
          <UspCard title={tLanding('usp.speed.title')} body={tLanding('usp.speed.body')} />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">{tLanding('howItWorks.title')}</h2>
          <ol className="grid gap-3 sm:grid-cols-4">
            {(['step1', 'step2', 'step3', 'step4'] as const).map((step, i) => (
              <li
                key={step}
                className="border-border bg-surface-2 flex flex-col gap-2 rounded-md border p-3"
              >
                <span className="text-primary text-sm font-semibold">{i + 1}</span>
                <h3 className="text-base font-semibold">{tLanding(`howItWorks.${step}.title`)}</h3>
                <p className="text-muted text-sm">{tLanding(`howItWorks.${step}.body`)}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-semibold">{tJobs('list.title')}</h2>
            <Link href="/jobs" className="text-primary text-sm underline">
              {tJobs('filters.apply')}
            </Link>
          </div>
          <JobsPreview />
        </div>
      </section>
    </CandidateShell>
  );
}

interface UspCardProps {
  title: string;
  body: string;
}

function UspCard({ title, body }: UspCardProps) {
  return (
    <article className="border-border bg-surface-2 shadow-card rounded-md border p-4">
      <h3 className="text-primary text-base font-semibold">{title}</h3>
      <p className="text-muted mt-2 text-sm">{body}</p>
    </article>
  );
}
