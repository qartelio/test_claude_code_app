'use client';

import { useTranslations } from 'next-intl';
import { useSyncExternalStore, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/store';
import { useNotificationStore } from '@/features/notifications/store';
import { useRouter } from '@/i18n/navigation';
import { db } from '@/mocks/db';

interface ApplyButtonProps {
  jobId: string;
}

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ApplyButton({ jobId }: ApplyButtonProps) {
  const isMounted = useIsMounted();
  const t = useTranslations('actions');
  const tNotif = useTranslations('notifications');
  const tLogin = useTranslations('jobs.detail');
  const currentUser = useAuthStore((s) => s.user);
  const router = useRouter();
  const push = useNotificationStore((s) => s.push);
  const [isPending, startTransition] = useTransition();

  if (!isMounted) {
    return <Button disabled>{t('loading')}</Button>;
  }

  if (currentUser.role !== 'candidate') {
    return (
      <Button
        onClick={() =>
          startTransition(() => {
            router.push('/login');
          })
        }
      >
        {tLogin('loginToApply')}
      </Button>
    );
  }

  function onApply() {
    startTransition(() => {
      const app = db.applications.create({ jobId, candidateId: currentUser.id });
      if (!app) {
        toast.error(tNotif('applicationFailed'));
        return;
      }
      push({ kind: 'applicationCreated', applicationId: app.id });
      toast.success(tNotif('applicationCreated'));
      router.push({
        pathname: '/candidate/applications/[id]',
        params: { id: app.id },
      });
    });
  }

  return (
    <Button onClick={onApply} disabled={isPending}>
      {t('apply')}
    </Button>
  );
}
