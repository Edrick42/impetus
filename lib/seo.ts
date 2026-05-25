import type { Metadata } from 'next';
import { env } from './env';
import { routing, type Locale } from '@/i18n/routing';

type BuildMetadataInput = {
  locale: Locale;
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
};

const siteName = 'Instituto Impetus';
const defaultOg = '/og-default.png';

export function absoluteUrl(path = ''): string {
  const base = env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = absoluteUrl(`/${l}${path === '/' ? '' : path}`);
  }
  languages['x-default'] = absoluteUrl(`/${routing.defaultLocale}${path === '/' ? '' : path}`);
  return languages;
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const {
    locale,
    title,
    description,
    path = '/',
    ogImage = defaultOg,
    type = 'website',
    publishedTime,
    authors,
  } = input;

  // Sem suffix aqui — o template do layout raiz aplica "%s | Instituto Impetus"
  // automaticamente quando uma página filha define seu próprio title.
  const ogTitle = title ? `${title} | ${siteName}` : siteName;
  const url = absoluteUrl(`/${locale}${path === '/' ? '' : path}`);

  return {
    title,
    description,
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    alternates: {
      canonical: url,
      languages: buildAlternates(path),
    },
    openGraph: {
      type,
      siteName,
      title: ogTitle,
      description,
      url,
      locale: locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

/* ============================================================
   JSON-LD builders — Schema.org structured data
   ============================================================ */

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Instituto Impetus',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/logo.png'),
    description:
      'Organização comprometida com impacto social, educação e empreendedorismo.',
    sameAs: [
      'https://www.instagram.com/institutoimpetus',
    ],
  };
}

export function websiteLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Instituto Impetus',
    url: absoluteUrl(`/${locale}`),
    inLanguage: locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl(`/${locale}/blog`)}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function eventLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Favela + Rica 2026',
    startDate: '2026-06-26',
    endDate: '2026-06-27',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Rio de Janeiro',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Rio de Janeiro',
        addressRegion: 'RJ',
        addressCountry: 'BR',
      },
    },
    description:
      'Evento que reúne empreendedores de favelas, investidores e lideranças em dois dias de networking, pitches e conteúdo de alto nível.',
    sponsor: {
      '@type': 'Organization',
      name: 'Instituto Impetus',
      url: absoluteUrl(`/${locale}`),
    },
    organizer: {
      '@type': 'Organization',
      name: 'Favela + Rica',
    },
  };
}

export function blogPostingLd(post: {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  cover?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    inLanguage: post.locale === 'pt' ? 'pt-BR' : post.locale === 'es' ? 'es-ES' : 'en-US',
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Instituto Impetus',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.png') },
    },
    image: post.cover ? absoluteUrl(post.cover) : absoluteUrl(defaultOg),
    mainEntityOfPage: absoluteUrl(`/${post.locale}/blog/${post.slug}`),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function imageGalleryLd(album: {
  locale: Locale;
  slug: string;
  name: string;
  description?: string;
  images: { url: string; caption?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: album.name,
    description: album.description,
    url: absoluteUrl(`/${album.locale}/galeria/${album.slug}`),
    image: album.images.map((img) => ({
      '@type': 'ImageObject',
      contentUrl: img.url,
      caption: img.caption,
    })),
  };
}
