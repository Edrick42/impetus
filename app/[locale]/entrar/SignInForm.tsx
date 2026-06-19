'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { signInAction, type SignInResult } from './actions';

type Props = {
  locale: string;
  denied: boolean;
};

export function SignInForm({ locale, denied }: Props) {
  const t = useTranslations('signIn');
  const [state, formAction, pending] = useActionState<SignInResult, FormData>(
    signInAction,
    undefined,
  );

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">{t('emailLabel')}</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded-md border border-border bg-bg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">{t('passwordLabel')}</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-border bg-bg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </label>

      {denied ? (
        <p role="alert" className="text-sm text-accent-orange">
          {t('denied')}
        </p>
      ) : null}

      {state?.error ? (
        <p role="alert" className="text-sm text-accent-orange">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
