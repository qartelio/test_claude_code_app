'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Country, Industry } from '../shared/types';
import type { CandidateLanguage } from './types';

export interface OnboardingDraft {
  country: Country | null;
  desiredCountries: ReadonlyArray<Country>;
  industries: ReadonlyArray<Industry>;
  experienceYears: number;
  languages: ReadonlyArray<CandidateLanguage>;
  passportName: string | null;
  passportBirthDate: string | null;
  phone: string | null;
  smsCode: string | null;
}

export const EMPTY_DRAFT: OnboardingDraft = {
  country: null,
  desiredCountries: [],
  industries: [],
  experienceYears: 0,
  languages: [],
  passportName: null,
  passportBirthDate: null,
  phone: null,
  smsCode: null,
};

interface OnboardingState {
  step: number;
  draft: OnboardingDraft;
  completedAt: string | null;
  setStep: (step: number) => void;
  update: (patch: Partial<OnboardingDraft>) => void;
  reset: () => void;
  complete: (at?: string) => void;
}

export const TOTAL_STEPS = 7;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 0,
      draft: EMPTY_DRAFT,
      completedAt: null,
      setStep: (step) => set({ step: Math.max(0, Math.min(TOTAL_STEPS - 1, step)) }),
      update: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      reset: () => set({ step: 0, draft: EMPTY_DRAFT, completedAt: null }),
      complete: (at) => set({ completedAt: at ?? new Date().toISOString() }),
    }),
    {
      name: 'work-abroad-onboarding-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
