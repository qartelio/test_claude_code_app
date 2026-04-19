import type { Country, Currency, Industry, LocalizedText } from '../shared/types';

export type JobStatus = 'draft' | 'pending_moderation' | 'active' | 'paused' | 'closed';
export type Benefit = 'housing' | 'meals' | 'insurance' | 'transfer' | 'bonus';
export type LanguageLevel = 'basic' | 'intermediate' | 'fluent';

export interface Job {
  id: string;
  employerId: string;
  title: LocalizedText;
  description: LocalizedText;
  country: Country;
  city: string;
  industry: Industry;
  salaryMin: number;
  salaryMax: number;
  currency: Currency;
  benefits: ReadonlyArray<Benefit>;
  requiredLanguages: ReadonlyArray<{ lang: string; level: LanguageLevel }>;
  requiredExperienceYears: number;
  seasonStart: string;
  seasonEnd: string;
  quota: number;
  applicationsCount: number;
  visaType: string | null;
  status: JobStatus;
  createdAt: string;
  audioDescriptionUrl: string | null;
}

export interface JobFilters {
  country?: Country;
  industry?: Industry;
  salaryMin?: number;
  page?: number;
  limit?: number;
}
