import { canTransition } from './machine';
import type { PipelineStage, StatusTransition } from './types';
import type { Application } from '../applications/types';

export class InvalidTransitionError extends Error {
  constructor(
    readonly from: PipelineStage,
    readonly to: PipelineStage,
  ) {
    super(`Invalid transition: ${from} → ${to}`);
    this.name = 'InvalidTransitionError';
  }
}

export interface TransitionInput {
  application: Application;
  to: PipelineStage;
  actorId: string | null;
  note: string | null;
  at?: string;
}

export interface TransitionResult {
  application: Application;
  transition: StatusTransition;
}

export function applyTransition(input: TransitionInput): TransitionResult {
  const { application, to, actorId, note } = input;
  if (!canTransition(application.status, to)) {
    throw new InvalidTransitionError(application.status, to);
  }
  const at = input.at ?? new Date().toISOString();
  const transition: StatusTransition = {
    from: application.status,
    to,
    at,
    actorId,
    note,
  };
  return {
    application: {
      ...application,
      status: to,
      history: [...application.history, transition],
      updatedAt: at,
    },
    transition,
  };
}

const BILLING_TRIGGERS: ReadonlyArray<PipelineStage> = ['employer_approved', 'arrived'];

export function triggersInvoice(stage: PipelineStage): boolean {
  return BILLING_TRIGGERS.includes(stage);
}
