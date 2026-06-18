import type { Metadata } from 'next';
import { env } from './env';
import { CONTACT } from './contact';
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
    logo: absoluteUrl('/logo-horizontal.svg'),
    description:
      'Organização comprometida com impacto social, educação e empreendedorismo.',
    email: CONTACT.email,
    telephone: CONTACT.phone.tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      addressRegion: CONTACT.address.region,
      postalCode: CONTACT.address.postalCode,
      addressCountry: CONTACT.address.country,
    },
    sameAs: [CONTACT.social.instagram],
  };
}

export function websiteLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Instituto Impetus',
    url: absoluteUrl(`/${locale}`),
    inLanguage: locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
  };
}

export function eventLd(locale: Locale) {
  const venue = {
    '@type': 'Place',
    name: 'ExpoRio – SulAmérica',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rio de Janeiro',
      addressRegion: 'RJ',
      addressCountry: 'BR',
    },
  };

  const organizer = [
    { '@type': 'Organization', name: 'Instituto Impetus', url: absoluteUrl(`/${locale}`) },
    { '@type': 'Organization', name: 'Instituto Coalizão Rio' },
  ];

  const offers = {
    '@type': 'Offer',
    url: 'https://linktr.ee/favelamaisrica',
    availability: 'https://schema.org/InStock',
    price: '0',
    priceCurrency: 'BRL',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Favela + Rica 2026',
    startDate: '2026-06-26T15:00:00-03:00',
    endDate: '2026-06-27T18:00:00-03:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: venue,
    description:
      'Evento de dois dias e grande escala voltado à educação, geração de renda e empreendedorismo em comunidades do Estado do Rio de Janeiro.',
    image: absoluteUrl('/events/favela-rica/photo-01.jpg'),
    organizer,
    offers,
    subEvent: [
      {
        '@type': 'Event',
        name: 'Favela + Rica — Dia 1 · Educação',
        startDate: '2026-06-26T15:00:00-03:00',
        endDate: '2026-06-26T21:00:00-03:00',
        location: venue,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        description:
          'Palestras e projetos em Educação que deram certo, com propostas de presidenciáveis sobre o tema.',
      },
      {
        '@type': 'Event',
        name: 'Favela + Rica — Dia 2 · Empreendedorismo',
        startDate: '2026-06-27T09:00:00-03:00',
        endDate: '2026-06-27T18:00:00-03:00',
        location: venue,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        description:
          'Palestras de alto impacto e histórias reais sobre empreendedorismo nas comunidades.',
      },
    ],
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
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo-horizontal.svg') },
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
