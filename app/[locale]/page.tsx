import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { Hero } from '@/components/home/Hero';
import { AboutSummary } from '@/components/home/AboutSummary';
import { ManifestoQuote } from '@/components/home/ManifestoQuote';
import { Projects } from '@/components/home/Projects';
import { EventSpotlight } from '@/components/home/EventSpotlight';
import { Impact } from '@/components/home/Impact';
import { ClosingCta } from '@/components/home/ClosingCta';

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
      <Hero />
      <AboutSummary />
      <ManifestoQuote />
      <Projects withCta />
      <EventSpotlight />
      <Impact />
      <ClosingCta />
    </>
  );
}
