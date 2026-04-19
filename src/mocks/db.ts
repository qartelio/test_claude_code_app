import type { Application, ApplicationEvent, ApplicationFilters } from '@/features/applications/types';
import type { CandidateProfile } from '@/features/candidates/types';
import type { Employer } from '@/features/employers/types';
import type { Job, JobFilters } from '@/features/jobs/types';
import { applyTransition } from '@/features/pipeline/transitions';
import type { PipelineStage } from '@/features/pipeline/types';

import { applicationEventsSeed, applicationsSeed } from './seed/applications.seed';
import { candidatesSeed } from './seed/candidates.seed';
import { employersSeed } from './seed/employers.seed';
import { jobsSeed } from './seed/jobs.seed';

interface DbState {
  jobs: ReadonlyArray<Job>;
  employers: ReadonlyArray<Employer>;
  candidates: ReadonlyArray<CandidateProfile>;
  applications: ReadonlyArray<Application>;
  events: ReadonlyArray<ApplicationEvent>;
}

const STORAGE_KEY = 'work-abroad-db-v2';

function loadFromStorage(): DbState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DbState;
  } catch {
    return null;
  }
}

function saveToStorage(state: DbState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or private mode — fail silently
  }
}

function initialState(): DbState {
  return {
    jobs: jobsSeed,
    employers: employersSeed,
    candidates: candidatesSeed,
    applications: applicationsSeed,
    events: applicationEventsSeed,
  };
}

let state: DbState = loadFromStorage() ?? initialState();

function persist(): void {
  saveToStorage(state);
}

function nextId(prefix: string, existing: ReadonlyArray<{ id: string }>): string {
  const max = existing.reduce((m, item) => {
    const suffix = item.id.split('-').at(-1) ?? '0';
    const n = Number.parseInt(suffix, 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

export const db = {
  reset(): void {
    state = initialState();
    persist();
  },

  jobs: {
    list(filters: JobFilters = {}): { items: ReadonlyArray<Job>; total: number } {
      let filtered: ReadonlyArray<Job> = state.jobs;
      if (filters.country) {
        filtered = filtered.filter((j) => j.country === filters.country);
      }
      if (filters.industry) {
        filtered = filtered.filter((j) => j.industry === filters.industry);
      }
      if (typeof filters.salaryMin === 'number') {
        filtered = filtered.filter((j) => j.salaryMax >= (filters.salaryMin ?? 0));
      }
      const total = filtered.length;
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const start = (page - 1) * limit;
      return { items: filtered.slice(start, start + limit), total };
    },

    findById(id: string): Job | null {
      return state.jobs.find((j) => j.id === id) ?? null;
    },
  },

  employers: {
    list(): ReadonlyArray<Employer> {
      return state.employers;
    },

    findById(id: string): Employer | null {
      return state.employers.find((e) => e.id === id) ?? null;
    },
  },

  candidates: {
    findByUserId(userId: string): CandidateProfile | null {
      return state.candidates.find((c) => c.userId === userId) ?? null;
    },
    upsert(profile: CandidateProfile): CandidateProfile {
      const existing = state.candidates.find((c) => c.userId === profile.userId);
      state = {
        ...state,
        candidates: existing
          ? state.candidates.map((c) => (c.userId === profile.userId ? profile : c))
          : [...state.candidates, profile],
      };
      persist();
      return profile;
    },
  },

  applications: {
    list(filters: ApplicationFilters = {}): {
      items: ReadonlyArray<Application>;
      total: number;
    } {
      let filtered: ReadonlyArray<Application> = state.applications;
      if (filters.candidateId) {
        filtered = filtered.filter((a) => a.candidateId === filters.candidateId);
      }
      if (filters.employerId) {
        filtered = filtered.filter((a) => a.employerId === filters.employerId);
      }
      if (filters.jobId) {
        filtered = filtered.filter((a) => a.jobId === filters.jobId);
      }
      if (filters.status) {
        filtered = filtered.filter((a) => a.status === filters.status);
      }
      filtered = [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      const total = filtered.length;
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 50;
      const start = (page - 1) * limit;
      return { items: filtered.slice(start, start + limit), total };
    },

    findById(id: string): Application | null {
      return state.applications.find((a) => a.id === id) ?? null;
    },

    create(input: {
      jobId: string;
      candidateId: string;
      coverLetter?: string | null;
    }): Application | null {
      const job = state.jobs.find((j) => j.id === input.jobId);
      if (!job) return null;
      const at = new Date().toISOString();
      const app: Application = {
        id: nextId('app', state.applications),
        jobId: input.jobId,
        candidateId: input.candidateId,
        employerId: job.employerId,
        status: 'submitted',
        history: [
          {
            from: null,
            to: 'submitted',
            at,
            actorId: input.candidateId,
            note: null,
          },
        ],
        coverLetter: input.coverLetter ?? null,
        matchScore: 0.7,
        createdAt: at,
        updatedAt: at,
        slaDueAt: new Date(Date.now() + 48 * 3_600_000).toISOString(),
      };
      const event: ApplicationEvent = {
        id: `evt-${app.id}-0`,
        applicationId: app.id,
        type: 'status_change',
        from: null,
        to: 'submitted',
        actorId: input.candidateId,
        payload: null,
        at,
      };
      state = {
        ...state,
        applications: [...state.applications, app],
        events: [...state.events, event],
      };
      persist();
      return app;
    },

    transition(
      id: string,
      to: PipelineStage,
      actorId: string | null,
      note: string | null = null,
    ): Application | null {
      const app = state.applications.find((a) => a.id === id);
      if (!app) return null;
      const { application, transition } = applyTransition({
        application: app,
        to,
        actorId,
        note,
      });
      const event: ApplicationEvent = {
        id: `evt-${id}-${application.history.length - 1}`,
        applicationId: id,
        type: 'status_change',
        from: transition.from,
        to: transition.to,
        actorId: transition.actorId,
        payload: note,
        at: transition.at,
      };
      state = {
        ...state,
        applications: state.applications.map((a) => (a.id === id ? application : a)),
        events: [...state.events, event],
      };
      persist();
      return application;
    },
  },

  events: {
    recent(limit = 20): ReadonlyArray<ApplicationEvent> {
      return [...state.events].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
    },
    byApplication(applicationId: string): ReadonlyArray<ApplicationEvent> {
      return state.events
        .filter((e) => e.applicationId === applicationId)
        .sort((a, b) => a.at.localeCompare(b.at));
    },
  },
};
