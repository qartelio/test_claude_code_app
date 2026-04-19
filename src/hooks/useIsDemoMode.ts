'use client';

import { useSearchParams } from 'next/navigation';
import { useSyncExternalStore } from 'react';

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useIsDemoMode(): boolean {
  const params = useSearchParams();
  const isMounted = useIsMounted();
  if (!isMounted) return false;
  return params.get('demo') === 'true';
}
