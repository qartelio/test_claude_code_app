'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface MswProviderProps {
  children: ReactNode;
}

export function MswProvider({ children }: MswProviderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      const { worker } = await import('./browser');
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: { url: '/mockServiceWorker.js' },
      });
      if (!cancelled) setReady(true);
    }
    start();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div
        aria-live="polite"
        className="text-muted flex min-h-screen items-center justify-center text-sm"
      >
        Инициализация мок-слоя…
      </div>
    );
  }

  return <>{children}</>;
}
