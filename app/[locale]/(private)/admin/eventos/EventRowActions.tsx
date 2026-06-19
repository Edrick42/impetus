'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Props = {
  locale: string;
  eventId: string;
  published: boolean;
  togglePublishedAction: (locale: string, eventId: string, next: boolean) => Promise<void>;
  deleteEventAction: (locale: string, eventId: string) => Promise<void>;
};

export function EventRowActions({
  locale,
  eventId,
  published,
  togglePublishedAction,
  deleteEventAction,
}: Props) {
  const t = useTranslations('admin.events');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await togglePublishedAction(locale, eventId, !published);
      router.refresh();
    });
  }

  function del() {
    if (!window.confirm(t('confirmDelete'))) return;
    startTransition(async () => {
      await deleteEventAction(locale, eventId);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={`rounded-md px-3 py-1 text-xs ${
          published
            ? 'bg-accent-green/15 text-accent-green'
            : 'bg-surface text-muted hover:bg-surface/80'
        }`}
      >
        {published ? t('unpublish') : t('publish')}
      </button>
      <button
        type="button"
        onClick={del}
        disabled={pending}
        className="rounded-md bg-surface px-3 py-1 text-xs text-muted hover:text-accent-orange"
      >
        {t('delete')}
      </button>
    </div>
  );
}
