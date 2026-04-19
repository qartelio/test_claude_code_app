import type { Application, ApplicationEvent } from '@/features/applications/types';
import type { PipelineStage, StatusTransition } from '@/features/pipeline/types';

import { TIMELINE_ORDER } from '@/features/pipeline/groups';

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

function buildHistory(path: ReadonlyArray<PipelineStage>, baseOffsetHours: number): StatusTransition[] {
  const steps = path.length;
  return path.map((stage, index) => {
    const from = index === 0 ? null : path[index - 1];
    const progress = index / Math.max(1, steps - 1);
    const hours = baseOffsetHours * (1 - progress);
    return {
      from,
      to: stage,
      at: hoursAgo(hours),
      actorId: stage === 'submitted' ? 'user-candidate-001' : 'user-employer-001',
      note: null,
    };
  });
}

interface AppSeedInput {
  id: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  path: ReadonlyArray<PipelineStage>;
  matchScore: number;
  coverLetter?: string;
  slaHours?: number;
}

function buildApp(input: AppSeedInput): Application {
  const history = buildHistory(input.path, 24 * 14);
  const createdAt = history[0]?.at ?? hoursAgo(24 * 14);
  const updatedAt = history[history.length - 1]?.at ?? createdAt;
  const status = input.path[input.path.length - 1] ?? 'submitted';
  return {
    id: input.id,
    jobId: input.jobId,
    candidateId: input.candidateId,
    employerId: input.employerId,
    status,
    history,
    coverLetter: input.coverLetter ?? null,
    matchScore: input.matchScore,
    createdAt,
    updatedAt,
    slaDueAt:
      input.slaHours !== undefined
        ? new Date(Date.now() + input.slaHours * 3_600_000).toISOString()
        : null,
  };
}

function take(to: PipelineStage): ReadonlyArray<PipelineStage> {
  const idx = TIMELINE_ORDER.indexOf(to);
  return TIMELINE_ORDER.slice(0, idx + 1);
}

export const applicationsSeed: ReadonlyArray<Application> = [
  buildApp({
    id: 'app-001',
    jobId: 'job-001',
    candidateId: 'user-candidate-001',
    employerId: 'emp-001',
    path: take('under_review'),
    matchScore: 0.82,
    coverLetter: 'Здравствуйте! Готова выйти на смену уже в мае — опыт работы 2 года.',
    slaHours: 48,
  }),
  buildApp({
    id: 'app-002',
    jobId: 'job-002',
    candidateId: 'user-candidate-001',
    employerId: 'emp-001',
    path: take('docs_submitted'),
    matchScore: 0.74,
    slaHours: 72,
  }),
  buildApp({
    id: 'app-003',
    jobId: 'job-004',
    candidateId: 'user-candidate-002',
    employerId: 'emp-003',
    path: take('employer_approved'),
    matchScore: 0.88,
    coverLetter: '5 лет опыта на тепличных хозяйствах в Ташкенте.',
    slaHours: 96,
  }),
  buildApp({
    id: 'app-004',
    jobId: 'job-008',
    candidateId: 'user-candidate-002',
    employerId: 'emp-004',
    path: take('visa_approved'),
    matchScore: 0.91,
  }),
  buildApp({
    id: 'app-005',
    jobId: 'job-012',
    candidateId: 'user-candidate-003',
    employerId: 'emp-005',
    path: take('employment_started'),
    matchScore: 0.79,
  }),
  buildApp({
    id: 'app-006',
    jobId: 'job-003',
    candidateId: 'user-candidate-001',
    employerId: 'emp-002',
    path: [...take('under_review'), 'rejected'] as ReadonlyArray<PipelineStage>,
    matchScore: 0.42,
  }),
];

export const applicationEventsSeed: ReadonlyArray<ApplicationEvent> = applicationsSeed.flatMap(
  (app) =>
    app.history.map<ApplicationEvent>((transition, index) => ({
      id: `evt-${app.id}-${index}`,
      applicationId: app.id,
      type: 'status_change',
      from: transition.from,
      to: transition.to,
      actorId: transition.actorId,
      payload: null,
      at: transition.at,
    })),
);
