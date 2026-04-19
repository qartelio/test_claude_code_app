'use client';

import { useEffect, useRef } from 'react';

import { useNotificationStore } from '@/features/notifications/store';
import { nextStages } from '@/features/pipeline/machine';
import { isTerminal } from '@/features/pipeline/groups';
import type { PipelineStage } from '@/features/pipeline/types';
import { db } from '@/mocks/db';

const TICK_INTERVAL_MS = 8_000;
const HAPPY_PATH_PRIORITY: ReadonlyArray<PipelineStage> = [
  'employer_approved',
  'under_review',
  'test_completed',
  'docs_submitted',
  'docs_approved',
  'visa_approved',
  'tickets_booked',
  'arrived',
  'employment_started',
  'completed',
];

function pickNextStage(current: PipelineStage): PipelineStage | null {
  const options = nextStages(current);
  if (options.length === 0) return null;
  const preferred = options.find((s) => HAPPY_PATH_PRIORITY.includes(s));
  if (preferred) return preferred;
  return options[Math.floor(Math.random() * options.length)] ?? null;
}

function advanceRandomApplication(): {
  applicationId: string;
  to: PipelineStage;
} | null {
  const { items } = db.applications.list();
  const active = items.filter((a) => !isTerminal(a.status));
  if (active.length === 0) return null;
  const target = active[Math.floor(Math.random() * active.length)];
  if (!target) return null;
  const next = pickNextStage(target.status);
  if (!next) return null;
  const updated = db.applications.transition(target.id, next, 'demo-clock', 'auto-progression');
  if (!updated) return null;
  return { applicationId: updated.id, to: next };
}

export interface UseDemoClockOptions {
  enabled: boolean;
  intervalMs?: number;
}

export function useDemoClock({ enabled, intervalMs = TICK_INTERVAL_MS }: UseDemoClockOptions): void {
  const push = useNotificationStore((s) => s.push);
  const pushRef = useRef(push);

  useEffect(() => {
    pushRef.current = push;
  }, [push]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    const handle = window.setInterval(() => {
      const result = advanceRandomApplication();
      if (!result) return;
      pushRef.current({
        kind: 'statusChanged',
        applicationId: result.applicationId,
        stage: result.to,
      });
    }, intervalMs);
    return () => {
      window.clearInterval(handle);
    };
  }, [enabled, intervalMs]);
}
