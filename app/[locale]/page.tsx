import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { Projects } from '@/components/home/Projects';
import { Events } from '@/components/home/Events';
import { GalleryPreview } from '@/components/home/GalleryPreview';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { BlogPreview } from '@/components/home/BlogPreview';
import { Contact } from '@/components/home/Contact';
import { JsonLd } from '@/components/seo/JsonLd';
import { eventLd } from '@/lib/seo';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={eventLd(locale)} />
      <Hero />
      <About />
      <Projects />
      <Events />
      <GalleryPreview />
      <InstagramFeed />
      <BlogPreview locale={locale} />
      <Contact />
    </>
  );
}
