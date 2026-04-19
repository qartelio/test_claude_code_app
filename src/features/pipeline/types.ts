export type PipelineStage =
  | 'submitted'
  | 'under_review'
  | 'test_assigned'
  | 'video_requested'
  | 'test_completed'
  | 'employer_approved'
  | 'candidate_declined'
  | 'docs_requested'
  | 'docs_submitted'
  | 'docs_approved'
  | 'visa_submitted'
  | 'visa_approved'
  | 'visa_denied'
  | 'tickets_booked'
  | 'arrived'
  | 'employment_started'
  | 'completed'
  | 'rejected'
  | 'withdrawn'
  | 'disputed';

export interface StatusTransition {
  from: PipelineStage | null;
  to: PipelineStage;
  at: string;
  actorId: string | null;
  note: string | null;
}
