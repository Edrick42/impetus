import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { ButtonLink } from '@/components/ui/Button';
import { getAlbums, getAlbumPhotos } from '@/lib/gallery';

export async function GalleryPreview() {
  const t = await getTranslations('galleryPreview');
  const albums = await getAlbums();
  const photos = albums.length ? (await getAlbumPhotos(albums[0]!.id)).slice(0, 6) : [];

  return (
    <Section id="galeria">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading className="mt-4">{t('title')}</Heading>
            <Lead className="mt-6">{t('lead')}</Lead>
          </div>
          <ButtonLink href="/galeria" variant="ghost">
            {t('cta')}
          </ButtonLink>
        </div>

        {photos.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3">
            {photos.map((p) => (
              <div
                key={p.id}
                className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface"
              >
                <Image
                  src={p.thumb}
                  alt={p.caption ?? ''}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-muted">{t('empty')}</p>
        )}
      </Container>
    </Section>
  );
}
