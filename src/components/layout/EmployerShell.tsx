import type { ReactNode } from 'react';

import { Topbar } from './Topbar';

interface EmployerShellProps {
  children: ReactNode;
}

export function EmployerShell({ children }: EmployerShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
