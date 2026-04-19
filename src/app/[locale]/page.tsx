import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { JobsPreview } from '@/components/landing/JobsPreview';
import { CandidateShell } from '@/components/layout/CandidateShell';
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
  const tNav = useTranslations('nav');

  return (
    <CandidateShell wide>
      <div className="flex flex-col gap-20 pb-16">
        {/* HERO */}
        <section className="bg-hero-gradient relative -mx-4 overflow-hidden px-4 pt-6 pb-16 sm:-mx-6 sm:px-6 sm:pb-20 lg:-mx-8 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-6">
              <span className="animate-fade-up border-primary/15 bg-primary-soft text-primary inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
                <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
                ILO 181 · 0 ₽ с работника
              </span>
              <h1 className="animate-fade-up text-foreground text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {tLanding('hero.title')
                  .split(' ')
                  .map((word, i, arr) =>
                    i === arr.length - 1 ? (
                      <span key={i} className="text-gradient-brand">
                        {word}
                      </span>
                    ) : (
                      <span key={i}>{word} </span>
                    ),
                  )}
              </h1>
              <p className="animate-fade-up-delay-1 text-muted max-w-xl text-lg sm:text-xl">
                {tLanding('hero.subtitle')}
              </p>
              <div className="animate-fade-up-delay-2 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/jobs"
                  className="bg-brand-gradient shadow-glow inline-flex h-14 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_12px_40px_-8px_rgba(37,99,235,0.6)]"
                >
                  {tLanding('hero.ctaCandidate')}
                  <IconArrow />
                </Link>
                <Link
                  href="/employers"
                  className="border-border bg-surface-2 hover:border-primary/40 hover:bg-primary-soft/50 inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 px-7 text-base font-semibold transition-all"
                >
                  {tLanding('hero.ctaEmployer')}
                </Link>
              </div>

              <dl className="mt-4 grid max-w-lg grid-cols-3 gap-6 pt-6">
                <Stat value="6" label="проверок" />
                <Stat value="14д" label="до найма" />
                <Stat value="0₽" label="с работника" />
              </dl>
            </div>

            <HeroVisual />
          </div>
        </section>

        {/* USP */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Почему мы"
            title="Безопасность встроена в платформу"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <UspCard
              icon={<IconShield />}
              tone="primary"
              title={tLanding('usp.safety.title')}
              body={tLanding('usp.safety.body')}
            />
            <UspCard
              icon={<IconEye />}
              tone="accent"
              title={tLanding('usp.transparency.title')}
              body={tLanding('usp.transparency.body')}
            />
            <UspCard
              icon={<IconBolt />}
              tone="warning"
              title={tLanding('usp.speed.title')}
              body={tLanding('usp.speed.body')}
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Процесс" title={tLanding('howItWorks.title')} />
          <ol className="relative mt-10 grid gap-6 md:grid-cols-4">
            <div
              aria-hidden
              className="from-primary/30 via-primary/20 absolute top-6 right-6 left-6 hidden h-px bg-gradient-to-r to-transparent md:block"
            />
            {(['step1', 'step2', 'step3', 'step4'] as const).map((step, i) => (
              <li
                key={step}
                className="border-border bg-surface-2 shadow-card hover:shadow-elevated relative flex flex-col gap-3 rounded-2xl border p-5 transition-all hover:-translate-y-0.5"
              >
                <span className="bg-brand-gradient shadow-glow flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="text-foreground text-lg font-semibold">
                  {tLanding(`howItWorks.${step}.title`)}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {tLanding(`howItWorks.${step}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* JOBS PREVIEW */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Вакансии"
              title={tJobs('list.title')}
              className="mb-0"
            />
            <Link
              href="/jobs"
              className="text-primary hover:text-primary-dark group inline-flex items-center gap-1 text-sm font-semibold whitespace-nowrap"
            >
              Все
              <span className="transition-transform group-hover:translate-x-0.5">
                <IconArrow />
              </span>
            </Link>
          </div>
          <div className="mt-8">
            <JobsPreview />
          </div>
        </section>

        {/* CTA BAND */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-gradient relative overflow-hidden rounded-3xl px-6 py-14 text-white shadow-[0_20px_60px_-20px_rgba(37,99,235,0.5)] sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(at 80% 20%, rgba(255,255,255,0.3), transparent 50%), radial-gradient(at 10% 80%, rgba(16,185,129,0.4), transparent 50%)',
              }}
            />
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Готовы начать?
                </h2>
                <p className="mt-2 text-white/85">
                  Создайте профиль за 3 минуты и откликайтесь на проверенные вакансии.
                </p>
              </div>
              <Link
                href="/signup"
                className="text-primary inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold shadow-lg transition-transform hover:scale-[1.02]"
              >
                {tNav('signUp')}
                <IconArrow />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CandidateShell>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  className?: string;
}

function SectionHeader({ eyebrow, title, className }: SectionHeaderProps) {
  return (
    <header className={`flex flex-col gap-2 ${className ?? ''}`}>
      <span className="text-primary text-xs font-bold tracking-[0.18em] uppercase">
        {eyebrow}
      </span>
      <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
    </header>
  );
}

interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps) {
  return (
    <div className="flex flex-col">
      <dt className="text-gradient-brand text-2xl font-bold sm:text-3xl">{value}</dt>
      <dd className="text-muted mt-0.5 text-xs font-medium tracking-wide uppercase">
        {label}
      </dd>
    </div>
  );
}

interface UspCardProps {
  icon: ReactNode;
  title: string;
  body: string;
  tone: 'primary' | 'accent' | 'warning';
}

function UspCard({ icon, title, body, tone }: UspCardProps) {
  const toneClasses = {
    primary: 'bg-primary-soft text-primary',
    accent: 'bg-accent-soft text-accent',
    warning: 'bg-amber-50 text-amber-600',
  } as const;

  return (
    <article className="border-border bg-surface-2 shadow-card hover:shadow-elevated group relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-1">
      <div
        className={`${toneClasses[tone]} flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground text-lg font-semibold">{title}</h3>
        <p className="text-muted text-sm leading-relaxed">{body}</p>
      </div>
    </article>
  );
}

function HeroVisual() {
  return (
    <div className="animate-fade-up-delay-2 relative hidden lg:block">
      <div className="relative h-[480px]">
        {/* Decorative blobs */}
        <div className="bg-primary/15 absolute -top-6 -right-6 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-accent/20 absolute right-20 bottom-0 h-60 w-60 rounded-full blur-3xl" />

        {/* Job card 1 */}
        <div className="border-border bg-surface-2 shadow-elevated absolute top-6 right-0 w-80 rotate-2 rounded-2xl border p-5 transition-transform hover:rotate-0">
          <div className="flex items-start gap-3">
            <div className="from-primary to-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl text-white">
              🇬🇧
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-foreground text-sm font-semibold">
                  Hospitality · London
                </h3>
                <span className="bg-accent-soft text-verified inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Verified
                </span>
              </div>
              <p className="text-muted mt-1 text-xs">Premium Hotel Group</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-foreground text-lg font-bold">£2,400</span>
                <span className="text-muted text-xs">/мес</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Chip>Жильё</Chip>
                <Chip>Питание</Chip>
                <Chip>Виза</Chip>
              </div>
            </div>
          </div>
        </div>

        {/* Job card 2 */}
        <div className="border-border bg-surface-2 shadow-elevated absolute top-52 left-0 w-72 -rotate-3 rounded-2xl border p-5 transition-transform hover:rotate-0">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl text-white">
              🇰🇷
            </div>
            <div className="flex-1">
              <h3 className="text-foreground text-sm font-semibold">
                Manufacturing · Seoul
              </h3>
              <p className="text-muted mt-1 text-xs">EPS verified</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-foreground text-lg font-bold">₩3,100,000</span>
                <span className="text-muted text-xs">/мес</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status card */}
        <div className="border-border bg-surface-2 shadow-elevated absolute right-16 bottom-2 w-64 rotate-1 rounded-2xl border p-4 transition-transform hover:rotate-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-success h-3 w-3 rounded-full" />
              <div className="bg-success/30 absolute inset-0 h-3 w-3 animate-ping rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-xs font-semibold">Вас одобрили!</p>
              <p className="text-muted text-[11px]">SLA: ответ за 4ч</p>
            </div>
          </div>
          <div className="mt-3 flex gap-1">
            <span className="bg-success h-1 flex-1 rounded-full" />
            <span className="bg-success h-1 flex-1 rounded-full" />
            <span className="bg-success h-1 flex-1 rounded-full" />
            <span className="bg-border h-1 flex-1 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="bg-surface-muted text-foreground inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium">
      {children}
    </span>
  );
}

function IconArrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}
