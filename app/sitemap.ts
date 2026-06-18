import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAlbums } from '@/lib/piwigo';
import { absoluteUrl, buildAlternates } from '@/lib/seo';

const STATIC_PATHS = [
  '/',
  '/sobre',
  '/projetos',
  '/projetos/magistratura-negra',
  '/eventos',
  '/contato',
  '/galeria',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Rotas estáticas × locales
  for (const path of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(`/${locale}${path === '/' ? '' : path}`),
        lastModified: now,
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1 : 0.7,
        alternates: { languages: buildAlternates(path) },
      });
    }
  }

  // Álbuns de galeria × locales
  const albums = await getAlbums();
  for (const album of albums) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(`/${locale}/galeria/${album.slug}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: { languages: buildAlternates(`/galeria/${album.slug}`) },
      });
    }
  }

  return entries;
}
