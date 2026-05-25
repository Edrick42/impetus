import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-container px-6 md:px-10 lg:px-16', className)}
      {...props}
    />
  );
}
