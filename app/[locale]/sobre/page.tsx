import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { About } from '@/components/home/About';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata, breadcrumbLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: 'about' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('lead'),
    path: '/sobre',
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: `/${locale}` },
          { name: t('title'), url: `/${locale}/sobre` },
        ])}
      />
      <About />
    </>
  );
}
