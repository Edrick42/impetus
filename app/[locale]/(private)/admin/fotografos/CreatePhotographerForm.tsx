'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

type EventOption = { id: string; name: string };

export function CreatePhotographerForm({ events }: { events: EventOption[] }) {
  const t = useTranslations('admin.photographers');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    setOkMsg(null);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const eventIds = formData.getAll('eventIds').map(String);

    startTransition(async () => {
      const res = await fetch('/api/admin/photographers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, eventIds }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? 'create_failed');
        return;
      }
      const j = await res.json();
      setOkMsg(t('created', { email: j.email }));
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="grid gap-4">
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">{t('emailLabel')}</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="off"
          className="rounded-md border border-border bg-bg px-4 py-3"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted">{t('passwordLabel')}</span>
        <input
          name="password"
          type="text"
          required
          minLength={8}
          autoComplete="off"
          className="rounded-md border border-border bg-bg px-4 py-3 font-mono"
        />
        <span className="text-xs text-muted">{t('passwordHint')}</span>
      </label>

      <fieldset className="rounded-md border border-border p-4">
        <legend className="text-sm text-muted">{t('eventsLabel')}</legend>
        {events.length === 0 ? (
          <p className="text-sm text-muted">{t('noEventsYet')}</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {events.map((ev) => (
              <li key={ev.id}>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="eventIds" value={ev.id} />
                  <span>{ev.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      {error ? <p role="alert" className="text-sm text-accent-orange">{error}</p> : null}
      {okMsg ? <p role="status" className="text-sm text-accent-green">{okMsg}</p> : null}

      <div>
        <Button type="submit" disabled={pending}>
          {pending ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
