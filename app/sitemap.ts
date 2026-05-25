import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllPosts } from '@/lib/mdx';
import { getAlbums } from '@/lib/piwigo';
import { absoluteUrl, buildAlternates } from '@/lib/seo';

const STATIC_PATHS = ['/', '/blog', '/galeria'] as const;

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

  // Posts do blog (por locale)
  for (const locale of routing.locales) {
    const posts = await getAllPosts(locale);
    for (const post of posts) {
      entries.push({
        url: absoluteUrl(`/${locale}/blog/${post.slug}`),
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'yearly',
        priority: 0.6,
        alternates: { languages: buildAlternates(`/blog/${post.slug}`) },
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
