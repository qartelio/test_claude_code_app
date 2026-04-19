import { setRequestLocale } from 'next-intl/server';

import { RoleSignupPanel } from '@/components/auth/RoleSignupPanel';
import { CandidateShell } from '@/components/layout/CandidateShell';

interface SignupPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SignupPage({ params }: SignupPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <CandidateShell>
      <section className="py-10">
        <RoleSignupPanel />
      </section>
    </CandidateShell>
  );
}
