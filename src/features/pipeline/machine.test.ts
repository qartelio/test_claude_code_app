import { describe, expect, it } from 'vitest';

import { ALL_STAGES, canTransition, nextStages } from './machine';
import type { PipelineStage } from './types';

describe('pipeline.canTransition — valid transitions', () => {
  it.each<[PipelineStage, PipelineStage]>([
    ['submitted', 'under_review'],
    ['submitted', 'rejected'],
    ['submitted', 'withdrawn'],
    ['under_review', 'test_assigned'],
    ['under_review', 'video_requested'],
    ['under_review', 'employer_approved'],
    ['under_review', 'rejected'],
    ['test_assigned', 'test_completed'],
    ['video_requested', 'test_completed'],
    ['test_completed', 'employer_approved'],
    ['test_completed', 'rejected'],
    ['employer_approved', 'docs_requested'],
    ['employer_approved', 'candidate_declined'],
    ['docs_requested', 'docs_submitted'],
    ['docs_submitted', 'docs_approved'],
    ['docs_submitted', 'docs_requested'],
    ['docs_approved', 'visa_submitted'],
    ['visa_submitted', 'visa_approved'],
    ['visa_submitted', 'visa_denied'],
    ['visa_denied', 'disputed'],
    ['visa_denied', 'rejected'],
    ['visa_approved', 'tickets_booked'],
    ['tickets_booked', 'arrived'],
    ['arrived', 'employment_started'],
    ['arrived', 'disputed'],
    ['employment_started', 'completed'],
    ['employment_started', 'disputed'],
    ['disputed', 'rejected'],
    ['disputed', 'employer_approved'],
  ])('allows %s → %s', (from, to) => {
    expect(canTransition(from, to)).toBe(true);
  });
});

describe('pipeline.canTransition — invalid transitions', () => {
  it.each<[PipelineStage, PipelineStage]>([
    ['submitted', 'employer_approved'],
    ['submitted', 'arrived'],
    ['under_review', 'completed'],
    ['rejected', 'under_review'],
    ['withdrawn', 'submitted'],
    ['completed', 'disputed'],
    ['candidate_declined', 'docs_requested'],
    ['employer_approved', 'rejected'],
    ['docs_approved', 'tickets_booked'],
    ['visa_denied', 'visa_approved'],
  ])('forbids %s → %s', (from, to) => {
    expect(canTransition(from, to)).toBe(false);
  });
});

describe('pipeline.canTransition — self-loops', () => {
  it.each(ALL_STAGES)('does not allow self-transition on %s', (stage) => {
    expect(canTransition(stage, stage)).toBe(false);
  });
});

describe('pipeline terminal stages', () => {
  it.each<PipelineStage>(['completed', 'rejected', 'withdrawn', 'candidate_declined'])(
    '%s has no outbound transitions',
    (stage) => {
      expect(nextStages(stage)).toHaveLength(0);
    },
  );
});

describe('pipeline coverage', () => {
  it('defines all HLD §7.1 stages (19 pipeline + disputed)', () => {
    expect(ALL_STAGES).toHaveLength(20);
  });
  it('includes every HLD §7.1 stage', () => {
    const required: ReadonlyArray<PipelineStage> = [
      'submitted',
      'under_review',
      'test_assigned',
      'video_requested',
      'test_completed',
      'employer_approved',
      'candidate_declined',
      'docs_requested',
      'docs_submitted',
      'docs_approved',
      'visa_submitted',
      'visa_approved',
      'visa_denied',
      'tickets_booked',
      'arrived',
      'employment_started',
      'completed',
      'rejected',
      'withdrawn',
      'disputed',
    ];
    for (const stage of required) {
      expect(ALL_STAGES).toContain(stage);
    }
  });
});
