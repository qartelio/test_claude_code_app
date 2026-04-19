import { describe, expect, it } from 'vitest';

import { InvalidTransitionError, applyTransition, triggersInvoice } from './transitions';
import type { Application } from '../applications/types';

function fixture(overrides: Partial<Application> = {}): Application {
  return {
    id: 'app-001',
    jobId: 'job-001',
    candidateId: 'user-candidate-001',
    employerId: 'emp-001',
    status: 'submitted',
    history: [],
    coverLetter: null,
    matchScore: 0.75,
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T10:00:00.000Z',
    slaDueAt: null,
    ...overrides,
  };
}

describe('applyTransition', () => {
  it('returns a new application with updated status and appended history', () => {
    const app = fixture({ status: 'submitted' });
    const result = applyTransition({
      application: app,
      to: 'under_review',
      actorId: 'user-employer-001',
      note: null,
      at: '2026-04-02T09:00:00.000Z',
    });
    expect(result.application.status).toBe('under_review');
    expect(result.application.history).toHaveLength(1);
    expect(result.application.history[0]).toMatchObject({
      from: 'submitted',
      to: 'under_review',
      actorId: 'user-employer-001',
    });
    expect(result.application.updatedAt).toBe('2026-04-02T09:00:00.000Z');
  });

  it('does not mutate the input application', () => {
    const app = fixture({ status: 'submitted' });
    applyTransition({ application: app, to: 'under_review', actorId: null, note: null });
    expect(app.status).toBe('submitted');
    expect(app.history).toHaveLength(0);
  });

  it('throws InvalidTransitionError on forbidden edges', () => {
    const app = fixture({ status: 'submitted' });
    expect(() =>
      applyTransition({ application: app, to: 'completed', actorId: null, note: null }),
    ).toThrow(InvalidTransitionError);
  });
});

describe('triggersInvoice', () => {
  it('fires on employer_approved and arrived', () => {
    expect(triggersInvoice('employer_approved')).toBe(true);
    expect(triggersInvoice('arrived')).toBe(true);
  });
  it('does not fire on other stages', () => {
    expect(triggersInvoice('submitted')).toBe(false);
    expect(triggersInvoice('completed')).toBe(false);
  });
});
