'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface WizardStepProps {
  stepKey: string | number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function WizardStep({ stepKey, title, subtitle, children, footer }: WizardStepProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-6"
      >
        <header className="flex flex-col gap-2">
          <h2 className="text-foreground text-2xl font-semibold">{title}</h2>
          {subtitle ? <p className="text-muted text-sm">{subtitle}</p> : null}
        </header>
        <div className="flex flex-col gap-4">{children}</div>
        {footer ? <div className="flex justify-between gap-3">{footer}</div> : null}
      </motion.div>
    </AnimatePresence>
  );
}
