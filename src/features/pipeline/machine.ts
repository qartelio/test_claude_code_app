import type { PipelineStage } from './types';

/**
 * Allowed transitions per HLD §7.1.
 * Keep the graph as data — pure, testable, no side effects.
 */
const transitions: Record<PipelineStage, ReadonlyArray<PipelineStage>> = {
  submitted: ['under_review', 'rejected', 'withdrawn'],
  under_review: ['test_assigned', 'video_requested', 'employer_approved', 'rejected'],
  test_assigned: ['test_completed', 'rejected', 'withdrawn'],
  video_requested: ['test_completed', 'rejected', 'withdrawn'],
  test_completed: ['employer_approved', 'rejected'],
  employer_approved: ['docs_requested', 'candidate_declined'],
  candidate_declined: [],
  docs_requested: ['docs_submitted', 'withdrawn'],
  docs_submitted: ['docs_approved', 'docs_requested'],
  docs_approved: ['visa_submitted'],
  visa_submitted: ['visa_approved', 'visa_denied'],
  visa_approved: ['tickets_booked'],
  visa_denied: ['disputed', 'rejected'],
  tickets_booked: ['arrived'],
  arrived: ['employment_started', 'disputed'],
  employment_started: ['completed', 'disputed'],
  completed: [],
  rejected: [],
  withdrawn: [],
  disputed: ['rejected', 'employer_approved'],
};

export function canTransition(from: PipelineStage, to: PipelineStage): boolean {
  return transitions[from]?.includes(to) ?? false;
}

export function nextStages(from: PipelineStage): ReadonlyArray<PipelineStage> {
  return transitions[from] ?? [];
}

export const ALL_STAGES: ReadonlyArray<PipelineStage> = Object.keys(transitions) as PipelineStage[];
