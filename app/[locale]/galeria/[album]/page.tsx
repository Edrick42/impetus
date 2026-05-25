import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Link } from '@/i18n/routing';
import { PhotoGrid } from '@/components/gallery/PhotoGrid';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAlbums, getAlbumBySlug, getAlbumPhotos } from '@/lib/piwigo';
import { buildMetadata, imageGalleryLd, breadcrumbLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateStaticParams() {
  const albums = await getAlbums();
  return albums.map((album) => ({ album: album.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; album: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, album: slug } = await params;
  const locale = rawLocale as Locale;
  const album = await getAlbumBySlug(slug);
  if (!album) return {};
  return buildMetadata({
    locale,
    title: album.name,
    description: album.description ?? `${album.photoCount} fotos`,
    path: `/galeria/${slug}`,
  });
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ locale: string; album: string }>;
}) {
  const { locale: rawLocale, album: slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  const photos = await getAlbumPhotos(album.id);
  const t = await getTranslations('gallery');
  const galleryTitle = t('title');

  return (
    <Container className="py-20 md:py-28">
      <JsonLd
        data={[
          imageGalleryLd({
            locale,
            slug,
            name: album.name,
            description: album.description,
            images: photos.map((p) => ({ url: p.src, caption: p.caption })),
          }),
          breadcrumbLd([
            { name: 'Home', url: `/${locale}` },
            { name: galleryTitle, url: `/${locale}/galeria` },
            { name: album.name, url: `/${locale}/galeria/${slug}` },
          ]),
        ]}
      />

      <Link href="/galeria" className="text-sm text-muted hover:text-fg">
        {t('back')}
      </Link>

      <div className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight md:text-5xl">
          {album.name}
        </h1>
        {album.description ? (
          <p className="mt-4 text-lg leading-relaxed text-muted md:text-xl">
            {album.description}
          </p>
        ) : null}
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-brand">
          {t('photos', { count: photos.length })}
        </p>
      </div>

      <div className="mt-12">
        <PhotoGrid photos={photos} albumName={album.name} />
      </div>
    </Container>
  );
}
