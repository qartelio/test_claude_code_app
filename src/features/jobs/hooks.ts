'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchJobs } from './api';
import type { JobFilters } from './types';

export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['jobs', filters] as const,
    queryFn: () => fetchJobs(filters),
  });
}
