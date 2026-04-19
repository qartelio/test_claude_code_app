'use client';

import { useTranslations } from 'next-intl';

import { TIMELINE_ORDER, isTerminal } from '@/features/pipeline/groups';
import type { PipelineStage } from '@/features/pipeline/types';
import { cn } from '@/lib/utils';

interface ApplicationStatusTimelineProps {
  current: PipelineStage;
}

export function ApplicationStatusTimeline({ current }: ApplicationStatusTimelineProps) {
  const tStage = useTranslations('candidate.pipeline');

  if (isTerminal(current) && current !== 'completed') {
    return (
      <div
        role="status"
        className="border-border bg-surface-2 rounded-md border p-3 text-sm text-[color:var(--color-danger)]"
      >
        {tStage(current)}
      </div>
    );
  }

  const currentIndex = TIMELINE_ORDER.indexOf(current);

  return (
    <ol
      aria-label="timeline"
      className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-x-visible"
    >
      {TIMELINE_ORDER.map((stage, index) => {
        const reached = currentIndex >= index;
        const active = stage === current;
        return (
          <li
            key={stage}
            aria-current={active ? 'step' : undefined}
            className={cn(
              'border-border flex shrink-0 flex-col items-start gap-1 rounded-md border px-3 py-2 text-xs',
              reached ? 'border-[color:var(--color-primary)]' : 'opacity-60',
              active ? 'bg-[color:var(--color-primary)] text-white' : 'bg-[color:var(--color-surface-2)]',
            )}
          >
            <span className="font-mono text-[10px] opacity-80">{index + 1}</span>
            <span className="font-medium">{tStage(stage)}</span>
          </li>
        );
      })}
    </ol>
  );
}
