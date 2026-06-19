'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function DeletePhotoButton({ photoId }: { photoId: string }) {
  const t = useTranslations('photographer');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm(t('confirmDelete'))) return;
    startTransition(async () => {
      const res = await fetch(`/api/photos/${photoId}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error ?? 'delete_failed');
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="rounded-md bg-white/15 px-3 py-1 text-xs text-white hover:bg-white/25"
      aria-label={t('delete')}
    >
      {pending ? t('deleting') : t('delete')}
      {err ? ` · ${err}` : ''}
    </button>
  );
}
