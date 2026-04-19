import type { ReactNode } from 'react';

import { CandidateBottomNav } from './CandidateBottomNav';
import { Topbar } from './Topbar';

interface CandidateShellProps {
  children: ReactNode;
  showBottomNav?: boolean;
  /** When true, inner container stretches to 7xl (landing). Otherwise max-w-3xl (reading). */
  wide?: boolean;
}

export function CandidateShell({
  children,
  showBottomNav = false,
  wide = false,
}: CandidateShellProps) {
  return (
    <div className="flex min-h-screen flex-col pb-20 sm:pb-0">
      <Topbar />
      <main
        className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 ${
          wide ? 'max-w-7xl' : 'max-w-3xl'
        }`}
      >
        {children}
      </main>
      {showBottomNav ? <CandidateBottomNav /> : null}
    </div>
  );
}
