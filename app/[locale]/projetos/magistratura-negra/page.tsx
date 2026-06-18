import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildMetadata, breadcrumbLd } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';

const PHOTOS = Array.from(
  { length: 7 },
  (_, i) => `/projects/magistratura-negra/photo-${String(i + 1).padStart(2, '0')}.jpg`,
);

type Screen2Item = { count: string; title: string; detail: string };
type Demographic = { value: string; label: string };
type ResultItem = { number: string; label: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = await getTranslations({ locale, namespace: 'magistraturaNegra' });
  return buildMetadata({
    locale,
    title: t('title'),
    description: t('lead'),
    path: '/projetos/magistratura-negra',
  });
}

export default async function MagistraturaNegraPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('magistraturaNegra');
  const projects = await getTranslations('projects');
  const screen2Items = t.raw('screen2.items') as Screen2Item[];
  const demographics = t.raw('screen2.demographics') as Demographic[];
  const resultItems = t.raw('results.items') as ResultItem[];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', url: `/${locale}` },
          { name: projects('title'), url: `/${locale}/projetos` },
          { name: t('title'), url: `/${locale}/projetos/magistratura-negra` },
        ])}
      />

      {/* HERO */}
      <Section tone="surface">
        <Container>
          <div className="max-w-4xl">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading level="display" className="mt-4">
              {t('title')}.
            </Heading>
            <Lead className="mt-8 max-w-3xl">{t('lead')}</Lead>
          </div>
        </Container>
      </Section>

      {/* FEATURE STORY — Drª Kalorine */}
      <Section tone="dark">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div className="overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PHOTOS[0]}
                alt={t('feature.name')}
                width={1200}
                height={1600}
                className="block h-auto w-full object-cover"
              />
            </div>
            <div>
              <Eyebrow className="text-bg/70">{t('feature.eyebrow')}</Eyebrow>
              <Heading level="display" className="mt-4 text-bg">
                {t('feature.title')}
              </Heading>
              <div className="mt-8">
                <p className="font-display text-xl font-medium text-bg md:text-2xl">
                  {t('feature.name')}
                </p>
                <p className="mt-1 text-sm text-bg/60">{t('feature.handle')}</p>
              </div>
              <p className="mt-8 text-lg leading-relaxed text-bg/85 md:text-xl">
                {t('feature.body')}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* SCREEN 1 — Conquistas Definitivas */}
      <Section tone="default">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <Eyebrow>{t('screen1.eyebrow')}</Eyebrow>
              <Heading className="mt-4">{t('screen1.title')}</Heading>
            </div>
            <p className="text-lg leading-relaxed text-fg/85 md:text-xl">
              {t('screen1.body')}
            </p>
          </div>
        </Container>
      </Section>

      {/* SCREEN 2 — Aprovações que marcam */}
      <Section tone="surface">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{t('screen2.eyebrow')}</Eyebrow>
            <Heading className="mt-4">{t('screen2.title')}</Heading>
            <Lead className="mt-6">{t('screen2.lead')}</Lead>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {screen2Items.map((item) => (
              <article
                key={`${item.count}-${item.title}`}
                className="flex flex-col gap-2 rounded-lg border border-border bg-bg p-8"
              >
                <p className="font-display text-4xl font-medium text-brand">
                  {item.count}
                </p>
                <h3 className="mt-2 font-display text-xl font-medium leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted">{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              {t('screen2.demographicsTitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-16 gap-y-6">
              {demographics.map((d) => (
                <div key={d.label}>
                  <p className="font-display text-3xl font-medium text-fg">
                    {d.value}
                  </p>
                  <p className="mt-1 text-sm text-muted">{d.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* RESULTS — Big numbers */}
      <Section tone="dark">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="text-bg/70">{t('results.eyebrow')}</Eyebrow>
            <Heading level="display" className="mt-4 text-bg">
              {t('results.title')}
            </Heading>
            <p className="mt-6 text-lg leading-relaxed text-bg/80 md:text-xl">
              {t('results.lead')}
            </p>
          </div>

          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            {resultItems.map((item) => (
              <article
                key={item.label}
                className="border-t border-bg/20 pt-6"
              >
                <p className="font-display text-5xl font-medium leading-none text-accent-yellow md:text-6xl">
                  {item.number}
                </p>
                <p className="mt-4 text-sm leading-snug text-bg/80 md:text-base">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* GALLERY */}
      <Section tone="surface">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{t('gallery.eyebrow')}</Eyebrow>
            <Heading className="mt-4">{t('gallery.title')}</Heading>
            <Lead className="mt-6">{t('gallery.lead')}</Lead>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {PHOTOS.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[3/4] overflow-hidden rounded-md bg-bg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${t('gallery.imageAlt')} ${i + 1}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Link
              href="/projetos"
              className="inline-flex items-center justify-center rounded-md border border-border bg-bg px-5 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface"
            >
              ← {t('backCta')}
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
