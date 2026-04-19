export type Country = 'TR' | 'UK' | 'KR' | 'PL' | 'DE' | 'NL';
export type Industry = 'hospitality' | 'agriculture' | 'manufacturing' | 'construction';
export type Currency = 'EUR' | 'USD' | 'GBP' | 'TRY' | 'KRW';
export type SupportedLocale = 'ru' | 'en' | 'tr';

export type LocalizedText = Partial<Record<SupportedLocale, string>> & {
  ru: string;
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
