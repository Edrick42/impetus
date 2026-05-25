import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-brand-fg hover:opacity-90',
  secondary: 'bg-fg text-bg hover:opacity-90',
  ghost: 'bg-transparent text-fg border border-border hover:bg-surface',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';

type ButtonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps & Omit<ComponentProps<'button'>, 'children' | 'className'>) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = ButtonProps & ComponentProps<typeof Link>;

export function ButtonLink({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
