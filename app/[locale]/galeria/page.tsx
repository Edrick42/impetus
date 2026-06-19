import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { AlbumGrid } from '@/components/gallery/AlbumGrid';
import { JsonLd } from '@/components/seo/JsonLd';
import { getAlbums } from '@/lib/gallery';
import { buildMetadata, breadcrumbLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: 'gallery' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('lead'),
    path: '/galeria',
  });
}

export default async function GalleryIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('gallery');
  const albums = await getAlbums();

  return (
    <Container className="py-20 md:py-28">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: `/${locale}` },
          { name: t('title'), url: `/${locale}/galeria` },
        ])}
      />

      <div className="max-w-3xl">
        <Eyebrow>{t('title')}</Eyebrow>
        <Heading level="display" className="mt-4">
          {t('title')}.
        </Heading>
        <Lead className="mt-6">{t('lead')}</Lead>
      </div>

      <div className="mt-16">
        {albums.length > 0 ? (
          <AlbumGrid albums={albums} />
        ) : (
          <p className="text-muted">{t('empty')}</p>
        )}
      </div>
    </Container>
  );
}
