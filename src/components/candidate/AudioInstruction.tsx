'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface AudioInstructionProps {
  audioKey: string;
  text: string;
  className?: string;
}

export function AudioInstruction({ audioKey, text, className }: AudioInstructionProps) {
  const locale = useLocale();
  const tActions = useTranslations('actions');
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLAudioElement>(null);

  const onToggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.pause();
      el.currentTime = 0;
      setPlaying(false);
      return;
    }
    el.play()
      .then(() => setPlaying(true))
      .catch(() => setError(true));
  }, [playing]);

  return (
    <div
      className={cn(
        'border-border bg-surface-2 flex items-start gap-3 rounded-md border p-3',
        className,
      )}
    >
      <button
        type="button"
        aria-label={tActions('listen')}
        onClick={onToggle}
        disabled={error}
        className={cn(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
          'bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-dark)]',
          'disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        {playing ? '■' : '▶'}
      </button>
      <p className="text-foreground text-sm">{text}</p>
      <audio
        ref={ref}
        preload="none"
        src={`/audio/${locale}/${audioKey}.mp3`}
        onEnded={() => setPlaying(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}
