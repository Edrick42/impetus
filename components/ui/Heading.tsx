import { cn } from '@/lib/utils';
import type { HTMLAttributes, ElementType } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: ElementType;
  level?: 'display' | 'section' | 'subsection';
};

const levelMap: Record<NonNullable<HeadingProps['level']>, string> = {
  display: 'text-4xl md:text-5xl lg:text-6xl',
  section: 'text-3xl md:text-4xl',
  subsection: 'text-2xl md:text-3xl',
};

export function Heading({
  className,
  as: Tag = 'h2',
  level = 'section',
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn('font-display font-medium tracking-tight', levelMap[level], className)}
      {...props}
    />
  );
}

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-block text-xs font-medium uppercase tracking-[0.18em] text-muted',
        className,
      )}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('max-w-2xl text-lg leading-relaxed text-muted md:text-xl', className)}
      {...props}
    />
  );
}
