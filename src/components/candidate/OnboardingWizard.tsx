'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState, useSyncExternalStore, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import type { Country, Industry } from '@/features/shared/types';
import { DEMO_USERS } from '@/features/auth/types';
import { useAuthStore } from '@/features/auth/store';
import {
  TOTAL_STEPS,
  useOnboardingStore,
  type OnboardingDraft,
} from '@/features/candidates/onboarding-store';
import type { CandidateLanguage, CandidateProfile, LangLevel } from '@/features/candidates/types';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

import { StepIndicator } from './StepIndicator';
import { WizardStep } from './WizardStep';

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const COUNTRIES: ReadonlyArray<Country> = ['TR', 'UK', 'KR', 'PL', 'DE', 'NL'];
const INDUSTRIES: ReadonlyArray<Industry> = ['hospitality', 'agriculture', 'manufacturing', 'construction'];
const LANG_LEVELS: ReadonlyArray<LangLevel> = ['basic', 'intermediate', 'fluent'];

function isDraftStepValid(step: number, draft: OnboardingDraft): boolean {
  switch (step) {
    case 0:
      return draft.country !== null;
    case 1:
      return draft.desiredCountries.length > 0;
    case 2:
      return draft.industries.length > 0;
    case 3:
      return draft.experienceYears >= 0;
    case 4:
      return draft.languages.length > 0;
    case 5:
      return draft.passportName !== null && draft.passportBirthDate !== null;
    case 6:
      return draft.phone !== null && draft.smsCode === '0000';
    default:
      return false;
  }
}

function LanguagesStep({
  languages,
  onChange,
}: {
  languages: ReadonlyArray<CandidateLanguage>;
  onChange: (next: ReadonlyArray<CandidateLanguage>) => void;
}) {
  const t = useTranslations('candidate.onboarding');
  const [lang, setLang] = useState('ru');
  const [level, setLevel] = useState<LangLevel>('basic');
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="border-border h-11 flex-1 rounded-md border bg-[color:var(--color-surface)] px-3"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          placeholder="ru"
          aria-label="lang"
        />
        <select
          className="border-border h-11 rounded-md border bg-[color:var(--color-surface)] px-3"
          value={level}
          onChange={(e) => setLevel(e.target.value as LangLevel)}
        >
          {LANG_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {t(`step.languages.level.${lvl}`)}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            const trimmed = lang.trim().toLowerCase();
            if (!trimmed) return;
            onChange([...languages.filter((x) => x.lang !== trimmed), { lang: trimmed, level }]);
            setLang('');
          }}
        >
          {t('step.languages.addLanguage')}
        </Button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {languages.map((l) => (
          <li
            key={l.lang}
            className="border-border bg-surface inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
          >
            <span className="font-medium uppercase">{l.lang}</span>
            <span className="text-muted">{t(`step.languages.level.${l.level}`)}</span>
            <button
              type="button"
              aria-label={`remove ${l.lang}`}
              className="text-muted hover:text-foreground"
              onClick={() => onChange(languages.filter((x) => x.lang !== l.lang))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PassportStep({
  name,
  birthDate,
  onChange,
}: {
  name: string | null;
  birthDate: string | null;
  onChange: (name: string | null, birthDate: string | null) => void;
}) {
  const t = useTranslations('candidate.onboarding');
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(name !== null);
  function simulateCapture() {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      onChange('Айнура Нурланова', '1998-07-14');
    }, 2000);
  }
  return (
    <div className="flex flex-col gap-4">
      {!scanned ? (
        <Button type="button" variant="secondary" onClick={simulateCapture} disabled={scanning}>
          {scanning ? t('step.passport.scanning') : t('step.passport.capture')}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">{t('step.passport.name')}</span>
            <input
              value={name ?? ''}
              onChange={(e) => onChange(e.target.value, birthDate)}
              className="border-border h-11 rounded-md border bg-[color:var(--color-surface)] px-3"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">{t('step.passport.birthDate')}</span>
            <input
              type="date"
              value={birthDate ?? ''}
              onChange={(e) => onChange(name, e.target.value)}
              className="border-border h-11 rounded-md border bg-[color:var(--color-surface)] px-3"
            />
          </label>
        </div>
      )}
    </div>
  );
}

function PhoneStep({
  phone,
  code,
  onChangePhone,
  onChangeCode,
}: {
  phone: string | null;
  code: string | null;
  onChangePhone: (phone: string | null) => void;
  onChangeCode: (code: string | null) => void;
}) {
  const t = useTranslations('candidate.onboarding');
  const [codeSent, setCodeSent] = useState(code !== null);
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">{t('step.phone.phone')}</span>
        <input
          type="tel"
          value={phone ?? ''}
          onChange={(e) => onChangePhone(e.target.value || null)}
          className="border-border h-11 rounded-md border bg-[color:var(--color-surface)] px-3"
          placeholder="+996 700 123 456"
        />
      </label>
      {!codeSent ? (
        <Button
          type="button"
          variant="secondary"
          disabled={!phone || phone.length < 6}
          onClick={() => setCodeSent(true)}
        >
          {t('step.phone.sendCode')}
        </Button>
      ) : (
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">{t('step.phone.code')}</span>
          <input
            inputMode="numeric"
            maxLength={4}
            value={code ?? ''}
            onChange={(e) => onChangeCode(e.target.value || null)}
            className="border-border h-11 rounded-md border bg-[color:var(--color-surface)] px-3"
            placeholder="0000"
          />
          {code !== null && code !== '0000' ? (
            <span className="text-[color:var(--color-danger)] text-xs">
              {t('step.phone.invalidCode')}
            </span>
          ) : null}
        </label>
      )}
    </div>
  );
}

export function OnboardingWizard() {
  const isMounted = useIsMounted();
  const t = useTranslations('candidate.onboarding');
  const tCountry = useTranslations('country');
  const tIndustry = useTranslations('industry');
  const tActions = useTranslations('actions');
  const store = useOnboardingStore();
  const currentUser = useAuthStore((s) => s.user);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const stepValid = useMemo(
    () => isDraftStepValid(store.step, store.draft),
    [store.step, store.draft],
  );

  const handleBack = useCallback(() => {
    if (store.step > 0) store.setStep(store.step - 1);
  }, [store]);

  const handleNext = useCallback(() => {
    if (!stepValid) return;
    if (store.step < TOTAL_STEPS - 1) {
      store.setStep(store.step + 1);
      return;
    }
    const candidate = currentUser.role === 'candidate' ? currentUser : DEMO_USERS.candidate;
    if (currentUser.role !== 'candidate') {
      useAuthStore.getState().signInAs('candidate');
    }
    const profile: CandidateProfile = {
      id: `cand-${candidate.id}`,
      userId: candidate.id,
      displayName: store.draft.passportName ?? candidate.displayName,
      avatarUrl: '/images/seed/avatar-default.jpg',
      country: store.draft.country ?? 'KR',
      city: '',
      desiredCountries: store.draft.desiredCountries,
      industries: store.draft.industries,
      experienceYears: store.draft.experienceYears,
      languages: store.draft.languages,
      phone: store.draft.phone ?? '',
      passportVerified: true,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    void import('@/mocks/db').then(({ db }) => db.candidates.upsert(profile));
    store.complete();
    startTransition(() => {
      router.replace('/candidate/jobs');
    });
  }, [currentUser, router, store, stepValid]);

  if (!isMounted) {
    return (
      <div className="border-border bg-surface-2 shadow-card min-h-[480px] rounded-md border p-6">
        <p className="text-muted text-sm">{tActions('loading')}</p>
      </div>
    );
  }

  const footer = (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={handleBack}
        disabled={store.step === 0 || isPending}
      >
        {t('back')}
      </Button>
      <Button type="button" onClick={handleNext} disabled={!stepValid || isPending}>
        {store.step === TOTAL_STEPS - 1 ? t('finish') : t('next')}
      </Button>
    </>
  );

  return (
    <div className="border-border bg-surface-2 shadow-card flex flex-col gap-6 rounded-md border p-6">
      <StepIndicator step={store.step} total={TOTAL_STEPS} />
      {store.step === 0 ? (
        <WizardStep
          stepKey="country"
          title={t('step.country.title')}
          subtitle={t('step.country.subtitle')}
          footer={footer}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COUNTRIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => store.update({ country: c })}
                className={cn(
                  'border-border rounded-md border p-4 text-sm font-medium transition-colors',
                  store.draft.country === c
                    ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white'
                    : 'hover:bg-[color:var(--color-surface)]',
                )}
              >
                {tCountry(c)}
              </button>
            ))}
          </div>
        </WizardStep>
      ) : null}

      {store.step === 1 ? (
        <WizardStep
          stepKey="desired"
          title={t('step.desiredCountries.title')}
          subtitle={t('step.desiredCountries.subtitle')}
          footer={footer}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COUNTRIES.map((c) => {
              const selected = store.draft.desiredCountries.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    store.update({
                      desiredCountries: selected
                        ? store.draft.desiredCountries.filter((x) => x !== c)
                        : [...store.draft.desiredCountries, c],
                    })
                  }
                  className={cn(
                    'border-border rounded-md border p-4 text-sm font-medium transition-colors',
                    selected
                      ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white'
                      : 'hover:bg-[color:var(--color-surface)]',
                  )}
                >
                  {tCountry(c)}
                </button>
              );
            })}
          </div>
        </WizardStep>
      ) : null}

      {store.step === 2 ? (
        <WizardStep
          stepKey="industry"
          title={t('step.industry.title')}
          subtitle={t('step.industry.subtitle')}
          footer={footer}
        >
          <div className="grid grid-cols-2 gap-3">
            {INDUSTRIES.map((i) => {
              const selected = store.draft.industries.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    store.update({
                      industries: selected
                        ? store.draft.industries.filter((x) => x !== i)
                        : [...store.draft.industries, i],
                    })
                  }
                  className={cn(
                    'border-border rounded-md border p-4 text-sm font-medium transition-colors',
                    selected
                      ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white'
                      : 'hover:bg-[color:var(--color-surface)]',
                  )}
                >
                  {tIndustry(i)}
                </button>
              );
            })}
          </div>
        </WizardStep>
      ) : null}

      {store.step === 3 ? (
        <WizardStep
          stepKey="experience"
          title={t('step.experience.title')}
          subtitle={t('step.experience.subtitle')}
          footer={footer}
        >
          <label className="flex flex-col gap-3">
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={store.draft.experienceYears}
              onChange={(e) => store.update({ experienceYears: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded bg-[color:var(--color-border)] accent-[color:var(--color-primary)]"
              aria-label={t('step.experience.title')}
            />
            <span className="text-foreground text-lg font-semibold">
              {t('experience.years', { years: store.draft.experienceYears })}
            </span>
          </label>
        </WizardStep>
      ) : null}

      {store.step === 4 ? (
        <WizardStep
          stepKey="languages"
          title={t('step.languages.title')}
          subtitle={t('step.languages.subtitle')}
          footer={footer}
        >
          <LanguagesStep
            languages={store.draft.languages}
            onChange={(languages) => store.update({ languages })}
          />
        </WizardStep>
      ) : null}

      {store.step === 5 ? (
        <WizardStep
          stepKey="passport"
          title={t('step.passport.title')}
          subtitle={t('step.passport.subtitle')}
          footer={footer}
        >
          <PassportStep
            name={store.draft.passportName}
            birthDate={store.draft.passportBirthDate}
            onChange={(name, birthDate) =>
              store.update({ passportName: name, passportBirthDate: birthDate })
            }
          />
        </WizardStep>
      ) : null}

      {store.step === 6 ? (
        <WizardStep
          stepKey="phone"
          title={t('step.phone.title')}
          subtitle={t('step.phone.subtitle')}
          footer={footer}
        >
          <PhoneStep
            phone={store.draft.phone}
            code={store.draft.smsCode}
            onChangePhone={(phone) => store.update({ phone })}
            onChangeCode={(smsCode) => store.update({ smsCode })}
          />
        </WizardStep>
      ) : null}
    </div>
  );
}
