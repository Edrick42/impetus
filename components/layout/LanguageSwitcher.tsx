'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { routing, type Locale } from '@/i18n/routing';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/clarity';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('languages');
  const common = useTranslations('common');
  const [isPending, startTransition] = useTransition();

  function onChange(next: Locale) {
    if (next === locale) return;
    trackEvent('language_switch', { from: locale, to: next });
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className={cn('flex items-center gap-1 text-xs', className)}
      role="group"
      aria-label={common('languageSwitcher')}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          disabled={isPending}
          onClick={() => onChange(l)}
          className={cn(
            'rounded-sm px-2 py-1 uppercase tracking-wider transition-opacity',
            l === locale ? 'font-medium text-fg' : 'text-muted hover:text-fg',
          )}
          aria-current={l === locale ? 'true' : undefined}
        >
          {l}
          <span className="sr-only"> — {t(l)}</span>
        </button>
      ))}
    </div>
  );
}
