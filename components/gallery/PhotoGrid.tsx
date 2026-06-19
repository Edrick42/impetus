'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { GalleryPhoto } from '@/lib/gallery';
import { Lightbox } from './Lightbox';

export function PhotoGrid({ photos, albumName }: { photos: GalleryPhoto[]; albumName: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-md bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
            aria-label={`Abrir foto ${i + 1} de ${photos.length}`}
          >
            <Image
              src={photo.thumb}
              alt={photo.caption ?? ''}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <Lightbox
          photos={photos}
          albumName={albumName}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </>
  );
}
