import type { PipelineStage } from './types';

export type StageGroup = 'screening' | 'preparation' | 'boarding' | 'archive';

export const STAGE_GROUPS: Record<StageGroup, ReadonlyArray<PipelineStage>> = {
  screening: [
    'submitted',
    'under_review',
    'test_assigned',
    'video_requested',
    'test_completed',
  ],
  preparation: [
    'employer_approved',
    'docs_requested',
    'docs_submitted',
    'docs_approved',
  ],
  boarding: [
    'visa_submitted',
    'visa_approved',
    'tickets_booked',
    'arrived',
    'employment_started',
  ],
  archive: [
    'completed',
    'rejected',
    'withdrawn',
    'candidate_declined',
    'visa_denied',
    'disputed',
  ],
};

const STAGE_TO_GROUP: Record<PipelineStage, StageGroup> = (() => {
  const acc = {} as Record<PipelineStage, StageGroup>;
  for (const [group, stages] of Object.entries(STAGE_GROUPS) as Array<
    [StageGroup, ReadonlyArray<PipelineStage>]
  >) {
    for (const stage of stages) acc[stage] = group;
  }
  return acc;
})();

export function stageGroup(stage: PipelineStage): StageGroup {
  return STAGE_TO_GROUP[stage];
}

export const TIMELINE_ORDER: ReadonlyArray<PipelineStage> = [
  'submitted',
  'under_review',
  'test_assigned',
  'video_requested',
  'test_completed',
  'employer_approved',
  'docs_requested',
  'docs_submitted',
  'docs_approved',
  'visa_submitted',
  'visa_approved',
  'tickets_booked',
  'arrived',
  'employment_started',
  'completed',
];

export function timelineIndex(stage: PipelineStage): number {
  return TIMELINE_ORDER.indexOf(stage);
}

export const TERMINAL_STAGES: ReadonlyArray<PipelineStage> = [
  'completed',
  'rejected',
  'withdrawn',
  'candidate_declined',
];

export function isTerminal(stage: PipelineStage): boolean {
  return TERMINAL_STAGES.includes(stage);
}
