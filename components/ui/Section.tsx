import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: 'default' | 'surface' | 'dark' | 'brand';
};

const toneMap: Record<NonNullable<SectionProps['tone']>, string> = {
  default: 'bg-bg text-fg',
  surface: 'bg-surface text-fg',
  dark: 'bg-fg text-bg',
  brand: 'bg-brand text-brand-fg',
};

export function Section({ className, tone = 'default', ...props }: SectionProps) {
  return (
    <section
      className={cn('py-20 md:py-28 lg:py-32', toneMap[tone], className)}
      {...props}
    />
  );
}
