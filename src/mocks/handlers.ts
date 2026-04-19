import { http, HttpResponse } from 'msw';

import { InvalidTransitionError } from '@/features/pipeline/transitions';
import type { PipelineStage } from '@/features/pipeline/types';
import type { Country, Industry } from '@/features/shared/types';

import { db } from './db';
import { simulatedDelay } from './delay';

function parseNumber(value: string | null): number | undefined {
  if (value === null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

interface CreateApplicationBody {
  jobId: string;
  candidateId: string;
  coverLetter?: string | null;
}

interface TransitionBody {
  to: PipelineStage;
  actorId: string | null;
  note?: string | null;
}

export const handlers = [
  http.get('/api/jobs', async ({ request }) => {
    await simulatedDelay();
    const url = new URL(request.url);
    const result = db.jobs.list({
      country: (url.searchParams.get('country') ?? undefined) as Country | undefined,
      industry: (url.searchParams.get('industry') ?? undefined) as Industry | undefined,
      salaryMin: parseNumber(url.searchParams.get('salaryMin')),
      page: parseNumber(url.searchParams.get('page')),
      limit: parseNumber(url.searchParams.get('limit')),
    });
    return HttpResponse.json({
      success: true,
      data: result.items,
      meta: {
        total: result.total,
        page: parseNumber(url.searchParams.get('page')) ?? 1,
        limit: parseNumber(url.searchParams.get('limit')) ?? 20,
      },
    });
  }),

  http.get('/api/jobs/:id', async ({ params }) => {
    await simulatedDelay();
    const job = db.jobs.findById(String(params.id));
    if (!job) {
      return HttpResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: job });
  }),

  http.get('/api/employers/:id', async ({ params }) => {
    await simulatedDelay();
    const employer = db.employers.findById(String(params.id));
    if (!employer) {
      return HttpResponse.json({ success: false, error: 'Employer not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: employer });
  }),

  http.get('/api/applications', async ({ request }) => {
    await simulatedDelay();
    const url = new URL(request.url);
    const result = db.applications.list({
      candidateId: url.searchParams.get('candidateId') ?? undefined,
      employerId: url.searchParams.get('employerId') ?? undefined,
      jobId: url.searchParams.get('jobId') ?? undefined,
      status: (url.searchParams.get('status') ?? undefined) as PipelineStage | undefined,
      page: parseNumber(url.searchParams.get('page')),
      limit: parseNumber(url.searchParams.get('limit')),
    });
    return HttpResponse.json({
      success: true,
      data: result.items,
      meta: {
        total: result.total,
        page: parseNumber(url.searchParams.get('page')) ?? 1,
        limit: parseNumber(url.searchParams.get('limit')) ?? 50,
      },
    });
  }),

  http.get('/api/applications/:id', async ({ params }) => {
    await simulatedDelay();
    const app = db.applications.findById(String(params.id));
    if (!app) {
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: app });
  }),

  http.post('/api/applications', async ({ request }) => {
    await simulatedDelay();
    const body = (await request.json()) as CreateApplicationBody;
    if (!body?.jobId || !body?.candidateId) {
      return HttpResponse.json(
        { success: false, error: 'jobId and candidateId are required' },
        { status: 400 },
      );
    }
    const app = db.applications.create(body);
    if (!app) {
      return HttpResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: app }, { status: 201 });
  }),

  http.post('/api/applications/:id/transition', async ({ params, request }) => {
    await simulatedDelay();
    const body = (await request.json()) as TransitionBody;
    try {
      const app = db.applications.transition(
        String(params.id),
        body.to,
        body.actorId,
        body.note ?? null,
      );
      if (!app) {
        return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }
      return HttpResponse.json({ success: true, data: app });
    } catch (error) {
      if (error instanceof InvalidTransitionError) {
        return HttpResponse.json(
          { success: false, error: `Invalid transition: ${error.from} → ${error.to}` },
          { status: 409 },
        );
      }
      throw error;
    }
  }),

  http.get('/api/events', async ({ request }) => {
    await simulatedDelay();
    const url = new URL(request.url);
    const appId = url.searchParams.get('applicationId');
    const events = appId ? db.events.byApplication(appId) : db.events.recent();
    return HttpResponse.json({ success: true, data: events });
  }),
];
