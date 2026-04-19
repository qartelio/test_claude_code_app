import type { PipelineStage, StatusTransition } from '../pipeline/types';

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  status: PipelineStage;
  history: ReadonlyArray<StatusTransition>;
  coverLetter: string | null;
  matchScore: number;
  createdAt: string;
  updatedAt: string;
  slaDueAt: string | null;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  type: 'status_change' | 'message' | 'document' | 'note';
  from: PipelineStage | null;
  to: PipelineStage | null;
  actorId: string | null;
  payload: string | null;
  at: string;
}

export interface ApplicationFilters {
  candidateId?: string;
  employerId?: string;
  jobId?: string;
  status?: PipelineStage;
  page?: number;
  limit?: number;
}
