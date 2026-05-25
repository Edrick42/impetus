import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { PiwigoAlbum } from '@/lib/piwigo';

export function AlbumGrid({ albums }: { albums: PiwigoAlbum[] }) {
  const t = useTranslations('gallery');

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {albums.map((album) => (
        <Link
          key={album.id}
          href={`/galeria/${album.slug}`}
          className="group block overflow-hidden rounded-lg border border-border bg-bg transition-shadow hover:shadow-md"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-surface">
            <Image
              src={album.cover}
              alt={album.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <h2 className="font-display text-xl font-medium leading-tight">
              {album.name}
            </h2>
            {album.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">{album.description}</p>
            ) : null}
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-brand">
              {t('photos', { count: album.photoCount })}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
