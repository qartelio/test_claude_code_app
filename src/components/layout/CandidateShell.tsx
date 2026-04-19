import type { ReactNode } from 'react';

import { CandidateBottomNav } from './CandidateBottomNav';
import { Topbar } from './Topbar';

interface CandidateShellProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export function CandidateShell({ children, showBottomNav = false }: CandidateShellProps) {
  return (
    <div className="flex min-h-screen flex-col pb-16 sm:pb-0">
      <Topbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">{children}</main>
      {showBottomNav ? <CandidateBottomNav /> : null}
    </div>
  );
}
