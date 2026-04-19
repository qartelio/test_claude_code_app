import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[image:var(--gradient-brand)] bg-[color:var(--color-primary)] text-white shadow-[0_4px_14px_-4px_rgba(37,99,235,0.45)] hover:shadow-[0_8px_24px_-6px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[color:var(--color-foreground)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-soft)] hover:text-[color:var(--color-primary)]',
        ghost:
          'text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-muted)]',
        destructive:
          'bg-[color:var(--color-danger)] text-white hover:opacity-90 shadow-[0_4px_14px_-4px_rgba(239,68,68,0.45)]',
        outline:
          'border-2 border-[color:var(--color-border)] bg-transparent text-[color:var(--color-foreground)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-soft)]',
      },
      size: {
        sm: 'h-9 px-4 text-xs',
        md: 'h-11 px-5',
        lg: 'h-12 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
