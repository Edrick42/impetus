'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Item = {
  id: string;
  name: string;
  size: number;
  status: 'queued' | 'signing' | 'uploading' | 'processing' | 'done' | 'error';
  progress: number;
  error?: string;
};

type Props = {
  eventSlug: string;
};

const ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/heic': ['.heic'],
  'image/heif': ['.heif'],
};

export function Uploader({ eventSlug }: Props) {
  const t = useTranslations('photographer');
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);

  const updateItem = useCallback((id: string, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const uploadOne = useCallback(
    async (item: Item, file: File) => {
      try {
        updateItem(item.id, { status: 'signing', progress: 5 });

        const signRes = await fetch('/api/upload/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventSlug,
            filename: file.name,
            contentType: file.type || 'application/octet-stream',
            sizeBytes: file.size,
          }),
        });
        if (!signRes.ok) {
          const err = await signRes.json().catch(() => ({}));
          throw new Error(err.error ?? 'sign_failed');
        }
        const { uploadUrl, stagingKey } = await signRes.json();

        updateItem(item.id, { status: 'uploading', progress: 15 });

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', uploadUrl, true);
          xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = 15 + Math.round((e.loaded / e.total) * 65);
              updateItem(item.id, { progress: pct });
            }
          };
          xhr.onload = () =>
            xhr.status >= 200 && xhr.status < 300
              ? resolve()
              : reject(new Error(`r2_put_${xhr.status}`));
          xhr.onerror = () => reject(new Error('r2_network'));
          xhr.send(file);
        });

        updateItem(item.id, { status: 'processing', progress: 85 });

        const completeRes = await fetch('/api/upload/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventSlug, stagingKey }),
        });
        if (!completeRes.ok) {
          const err = await completeRes.json().catch(() => ({}));
          throw new Error(err.error ?? 'complete_failed');
        }
        updateItem(item.id, { status: 'done', progress: 100 });
      } catch (err) {
        updateItem(item.id, {
          status: 'error',
          error: err instanceof Error ? err.message : 'unknown',
        });
      }
    },
    [eventSlug, updateItem],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      const newItems: Item[] = accepted.map((f) => ({
        id: `${Date.now()}-${f.name}-${Math.random().toString(36).slice(2)}`,
        name: f.name,
        size: f.size,
        status: 'queued',
        progress: 0,
      }));
      setItems((prev) => [...newItems, ...prev]);

      // Concurrency = 3
      let i = 0;
      const next = async () => {
        while (i < newItems.length) {
          const idx = i++;
          await uploadOne(newItems[idx]!, accepted[idx]!);
        }
      };
      Promise.all([next(), next(), next()]).then(() => router.refresh());
    },
    [router, uploadOne],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: 30 * 1024 * 1024,
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          isDragActive
            ? 'border-brand bg-brand/5'
            : 'border-border bg-surface/40 hover:border-brand'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-base font-medium">{t('dropTitle')}</p>
        <p className="mt-2 text-sm text-muted">{t('dropHint')}</p>
      </div>

      {items.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="rounded-md border border-border bg-bg p-3 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate font-medium">{it.name}</span>
                <span className="shrink-0 text-xs text-muted">
                  {(it.size / (1024 * 1024)).toFixed(1)} MB · {t(`status.${it.status}`)}
                  {it.error ? ` · ${it.error}` : ''}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-surface">
                <div
                  className={`h-full transition-all ${
                    it.status === 'error' ? 'bg-accent-orange' : 'bg-brand'
                  }`}
                  style={{ width: `${it.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
