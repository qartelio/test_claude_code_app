import type { Job, JobFilters } from './types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { total: number; page: number; limit: number };
}

function toSearchParams(filters: JobFilters): string {
  const params = new URLSearchParams();
  if (filters.country) params.set('country', filters.country);
  if (filters.industry) params.set('industry', filters.industry);
  if (typeof filters.salaryMin === 'number') {
    params.set('salaryMin', String(filters.salaryMin));
  }
  if (typeof filters.page === 'number') params.set('page', String(filters.page));
  if (typeof filters.limit === 'number') params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchJobs(
  filters: JobFilters = {},
): Promise<{ items: ReadonlyArray<Job>; total: number }> {
  const response = await fetch(`/api/jobs${toSearchParams(filters)}`);
  if (!response.ok) {
    throw new Error(`GET /api/jobs failed: ${response.status}`);
  }
  const body = (await response.json()) as ApiResponse<ReadonlyArray<Job>>;
  if (!body.success || !body.data) {
    throw new Error(body.error ?? 'Unknown error');
  }
  return { items: body.data, total: body.meta?.total ?? body.data.length };
}
