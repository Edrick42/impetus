'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type EventOption = { id: string; name: string };

type Props = {
  userId: string;
  email: string;
  events: EventOption[];
  assignedIds: string[];
};

export function AssignEventsForm({ userId, email, events, assignedIds }: Props) {
  const t = useTranslations('admin.photographers');
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set(assignedIds));
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function toggle(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await fetch('/api/admin/photographers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventIds: Array.from(selected) }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsg(j.error ?? 'save_failed');
        return;
      }
      setMsg(t('saved'));
      router.refresh();
    });
  }

  return (
    <details className="rounded-md border border-border bg-bg p-4">
      <summary className="cursor-pointer text-sm">
        <span className="font-medium">{email}</span>{' '}
        <span className="text-muted">
          · {t('assignedCount', { count: selected.size })}
        </span>
      </summary>
      <div className="mt-4">
        {events.length === 0 ? (
          <p className="text-sm text-muted">{t('noEventsYet')}</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {events.map((ev) => (
              <li key={ev.id}>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.has(ev.id)}
                    onChange={() => toggle(ev.id)}
                  />
                  <span>{ev.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded-md bg-brand px-4 py-2 text-sm text-brand-fg hover:opacity-90 disabled:opacity-50"
          >
            {pending ? t('saving') : t('save')}
          </button>
          {msg ? <span className="text-xs text-muted">{msg}</span> : null}
        </div>
      </div>
    </details>
  );
}
