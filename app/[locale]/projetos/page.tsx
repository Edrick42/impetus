import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { Projects } from '@/components/home/Projects';
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
  const t = await getTranslations({ locale, namespace: 'projects' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('lead'),
    path: '/projetos',
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('projects');

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: `/${locale}` },
          { name: t('title'), url: `/${locale}/projetos` },
        ])}
      />

      <Section tone="default">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading level="display" className="mt-4">
              {t('title')}
            </Heading>
            <Lead className="mt-6">{t('lead')}</Lead>
          </div>
        </Container>
      </Section>

      <Projects />
    </>
  );
}
