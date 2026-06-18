import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Events } from '@/components/home/Events';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata, breadcrumbLd, eventLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: 'events' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('body'),
    path: '/eventos',
  });
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('events');

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Home', url: `/${locale}` },
            { name: t('title'), url: `/${locale}/eventos` },
          ]),
          eventLd(locale),
        ]}
      />
      <Events />
    </>
  );
}
