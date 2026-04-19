import { setRequestLocale } from 'next-intl/server';

import { RoleLoginPanel } from '@/components/auth/RoleLoginPanel';
import { CandidateShell } from '@/components/layout/CandidateShell';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <CandidateShell>
      <section className="py-10">
        <RoleLoginPanel />
      </section>
    </CandidateShell>
  );
}
