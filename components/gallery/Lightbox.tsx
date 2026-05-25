'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PiwigoPhoto } from '@/lib/piwigo';
import { trackEvent } from '@/lib/clarity';

type Props = {
  photos: PiwigoPhoto[];
  albumName: string;
  startIndex: number;
  onClose: () => void;
};

export function Lightbox({ photos, albumName, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);
  const [toast, setToast] = useState<string | null>(null);
  const t = useTranslations('gallery');
  const photo = photos[index]!;

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  async function handleDownload() {
    trackEvent('download_photo', { albumName, photoId: photo.id });
    try {
      const res = await fetch(photo.download);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${albumName.replace(/\s+/g, '-').toLowerCase()}-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(photo.download, '_blank', 'noopener');
    }
  }

  async function handleShare() {
    trackEvent('share_photo', { albumName, photoId: photo.id });
    const shareData = {
      title: albumName,
      text: photo.caption ?? albumName,
      url: photo.src,
    };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled — segue para fallback abaixo
      }
    }
    try {
      await navigator.clipboard.writeText(photo.src);
      setToast(t('shareCopied'));
      setTimeout(() => setToast(null), 2000);
    } catch {
      // último fallback: abre nova aba
      window.open(photo.src, '_blank', 'noopener');
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={albumName}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 text-sm">
        <span className="text-white/70">
          {index + 1} / {photos.length}
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            {t('download')}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            {t('share')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 py-6">
        <button
          type="button"
          onClick={prev}
          aria-label={t('previous')}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 md:left-6"
        >
          ←
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.caption ?? ''}
          className="max-h-full max-w-full object-contain"
        />

        <button
          type="button"
          onClick={next}
          aria-label={t('next')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 md:right-6"
        >
          →
        </button>
      </div>

      {photo.caption ? (
        <p className="border-t border-white/10 px-6 py-3 text-center text-sm text-white/80">
          {photo.caption}
        </p>
      ) : null}

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-white px-4 py-2 text-sm text-black shadow-md"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
