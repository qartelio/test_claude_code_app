import type { Country, Industry } from '../shared/types';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'premium';
export type EmployerLicense = 'GLAA' | 'POEA' | 'EPS' | 'DMW';
export type EmployerPlan = 'starter' | 'growth' | 'scale' | 'enterprise';

export interface Employer {
  id: string;
  tenantId: string;
  name: string;
  legalName: string;
  country: Country;
  industry: Industry;
  verificationStatus: VerificationStatus;
  licenses: ReadonlyArray<EmployerLicense>;
  rating: number;
  hiresCount: number;
  logoUrl: string;
  videoIntroUrl: string | null;
  foundedYear: number;
  employeesCount: number;
  plan: EmployerPlan;
  contactPersonName: string;
  website: string;
}
