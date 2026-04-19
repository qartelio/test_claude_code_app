import type { Country, Industry } from '../shared/types';

export type LangLevel = 'basic' | 'intermediate' | 'fluent';

export interface CandidateLanguage {
  lang: string;
  level: LangLevel;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  country: Country;
  city: string;
  desiredCountries: ReadonlyArray<Country>;
  industries: ReadonlyArray<Industry>;
  experienceYears: number;
  languages: ReadonlyArray<CandidateLanguage>;
  phone: string;
  passportVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
}
