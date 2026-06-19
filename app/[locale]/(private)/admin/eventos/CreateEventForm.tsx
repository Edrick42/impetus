'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { createEventAction, type ActionResult } from './actions';

export function CreateEventForm({ locale }: { locale: string }) {
  const t = useTranslations('admin.events');
  const [state, action, pending] = useActionState<ActionResult, FormData>(
    createEventAction,
    undefined,
  );

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />

      <label className="flex flex-col gap-2 text-sm md:col-span-2">
        <span className="text-muted">{t('nameLabel')}</span>
        <input
          name="name"
          required
          className="rounded-md border border-border bg-bg px-4 py-3"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">{t('slugLabel')}</span>
        <input
          name="slug"
          required
          pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
          placeholder="favela-rica-2026"
          className="rounded-md border border-border bg-bg px-4 py-3"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">{t('dateLabel')}</span>
        <input
          name="event_date"
          type="date"
          className="rounded-md border border-border bg-bg px-4 py-3"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm md:col-span-2">
        <span className="text-muted">{t('descriptionLabel')}</span>
        <textarea
          name="description"
          rows={3}
          className="rounded-md border border-border bg-bg px-4 py-3"
        />
      </label>

      {state?.error ? (
        <p role="alert" className="text-sm text-accent-orange md:col-span-2">
          {state.error}
        </p>
      ) : null}

      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
