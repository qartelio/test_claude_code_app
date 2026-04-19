'use client';

import { Suspense } from 'react';

import { useDemoClock } from '@/hooks/useDemoClock';
import { useIsDemoMode } from '@/hooks/useIsDemoMode';

function Runner() {
  const enabled = useIsDemoMode();
  useDemoClock({ enabled });
  return null;
}

export function DemoClockRunner() {
  return (
    <Suspense fallback={null}>
      <Runner />
    </Suspense>
  );
}
