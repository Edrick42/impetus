import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { FAVELA_RICA } from '@/lib/event';

type DayHighlight = { title: string; body: string };
type BenefitItem = { title: string; amount: string; body: string };
type ActionAxis = { label: string; title: string; body: string };

export function Events() {
  const t = useTranslations('events');

  const day1Audience = t.raw('days.day1.audience') as string[];
  const day1Delivers = t.raw('days.day1.delivers') as string[];
  const day2Audience = t.raw('days.day2.audience') as string[];
  const day2Delivers = t.raw('days.day2.delivers') as string[];
  const day2Highlights = t.raw('days.day2.highlights') as DayHighlight[];
  const aboutParagraphs = t.raw('about.paragraphs') as string[];
  const benefitItems = t.raw('benefits.items') as BenefitItem[];
  const actionAxes = t.raw('actions.axes') as ActionAxis[];
  const realizationItems = t.raw('realization.items') as string[];
  const coordinationItems = t.raw('coordination.items') as string[];

  return (
    <>
      {/* HERO — banner full-bleed */}
      <section id="eventos" className="bg-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FAVELA_RICA.bannerSrc}
          alt={`${t('title')} · ${t('tagline')}`}
          width={1376}
          height={768}
          className="block h-auto w-full"
        />
        <Container className="py-12 md:py-16">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap gap-8 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                  Data
                </p>
                <p className="mt-1 font-display text-xl font-medium md:text-2xl">
                  {t('date')}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                  Local
                </p>
                <p className="mt-1 font-display text-xl font-medium md:text-2xl">
                  {t('venueName')}
                </p>
                <p className="text-sm text-muted">{t('location')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={FAVELA_RICA.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-medium text-brand-fg transition-opacity hover:opacity-90"
              >
                {t('ctaRegister')}
              </a>
              <a
                href={FAVELA_RICA.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-5 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface"
              >
                {t('ctaLinks')}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* VIDEO */}
      <Section tone="default" className="!py-16 md:!py-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Eyebrow>{t('video.title')}</Eyebrow>
            <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <video
                controls
                preload="metadata"
                poster={FAVELA_RICA.posterSrc}
                className="aspect-video w-full bg-fg"
              >
                <source src={FAVELA_RICA.videoSrc} type="video/mp4" />
                {t('video.fallback')}
              </video>
            </div>
          </div>
        </Container>
      </Section>

      {/* ABOUT */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <Eyebrow>{t('about.title')}</Eyebrow>
              <Heading className="mt-4">{t('title')}</Heading>
            </div>
            <div className="space-y-6">
              {aboutParagraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-fg/85 md:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* DAYS */}
      <Section tone="default">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{t('days.title')}</Eyebrow>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
            <DayCard
              label={t('days.day1.label')}
              date={t('days.day1.date')}
              schedule={t('days.day1.schedule')}
              theme={t('days.day1.theme')}
              lead={t('days.day1.lead')}
              audienceTitle={t('days.day1.audienceTitle')}
              audience={day1Audience}
              deliversTitle={t('days.day1.deliversTitle')}
              delivers={day1Delivers}
              highlightTitle={t('days.day1.highlightTitle')}
              highlights={[{ title: '', body: t('days.day1.highlight') }]}
            />
            <DayCard
              label={t('days.day2.label')}
              date={t('days.day2.date')}
              schedule={t('days.day2.schedule')}
              theme={t('days.day2.theme')}
              lead={t('days.day2.lead')}
              audienceTitle={t('days.day2.audienceTitle')}
              audience={day2Audience}
              deliversTitle={t('days.day2.deliversTitle')}
              delivers={day2Delivers}
              highlightTitle={t('days.day2.highlightsTitle')}
              highlights={day2Highlights}
            />
          </div>
        </Container>
      </Section>

      {/* BENEFITS */}
      <Section tone="dark">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="text-bg/70">{t('benefits.title')}</Eyebrow>
            <Heading className="mt-4 text-bg">{t('benefits.title')}.</Heading>
            <Lead className="mt-6 text-bg/80">{t('benefits.lead')}</Lead>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefitItems.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-3 border-t border-bg/20 pt-6"
              >
                <p className="font-display text-3xl font-medium text-accent-yellow">
                  {item.amount}
                </p>
                <h3 className="font-display text-xl font-medium text-bg">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-bg/75">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* BOOKSTORE + ASSOCIATION */}
      <Section tone="default">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <article className="rounded-lg border border-border bg-surface p-8 md:p-10">
              <Eyebrow>{t('bookstore.title')}</Eyebrow>
              <h3 className="mt-4 font-display text-2xl font-medium leading-tight md:text-3xl">
                12.000+ obras
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {t('bookstore.body')}
              </p>
            </article>

            <article className="rounded-lg border border-border bg-surface p-8 md:p-10">
              <Eyebrow>{t('association.label')}</Eyebrow>
              <h3 className="mt-4 font-display text-2xl font-medium leading-tight md:text-3xl">
                {t('association.title')}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {t('association.body')}
              </p>
            </article>
          </div>
        </Container>
      </Section>

      {/* SOCIAL ACTIONS */}
      <Section tone="surface">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{t('actions.title')}</Eyebrow>
            <Heading className="mt-4">{t('actions.title')}.</Heading>
            <Lead className="mt-6">{t('actions.lead')}</Lead>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {actionAxes.map((axis) => (
              <article
                key={axis.title}
                className="flex flex-col gap-4 rounded-lg border border-border bg-bg p-8"
              >
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
                  {axis.label}
                </span>
                <h3 className="font-display text-xl font-medium leading-tight">
                  {axis.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{axis.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* VENUE + REALIZATION + COORDINATION */}
      <Section tone="default">
        <Container>
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <Eyebrow>{t('venue.title')}</Eyebrow>
              <p className="mt-4 font-display text-2xl font-medium leading-tight">
                {t('venue.name')}
              </p>
              <p className="mt-2 text-sm text-muted">{t('venue.city')}</p>
            </div>
            <div>
              <Eyebrow>{t('realization.title')}</Eyebrow>
              <ul className="mt-4 space-y-1">
                {realizationItems.map((item) => (
                  <li key={item} className="font-display text-lg font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow>{t('coordination.title')}</Eyebrow>
              <ul className="mt-4 space-y-1">
                {coordinationItems.map((item) => (
                  <li key={item} className="font-display text-lg font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* GALLERY */}
      <Section tone="surface">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{t('gallery.title')}</Eyebrow>
            <Heading className="mt-4">{t('gallery.title')}.</Heading>
            <Lead className="mt-6">{t('gallery.lead')}</Lead>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {FAVELA_RICA.photos.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[4/5] overflow-hidden rounded-md bg-bg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${t('gallery.imageAlt')} ${i + 1}`}
                  loading="lazy"
                  width={1080}
                  height={1350}
                  className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

type DayCardProps = {
  label: string;
  date: string;
  schedule: string;
  theme: string;
  lead: string;
  audienceTitle: string;
  audience: string[];
  deliversTitle: string;
  delivers: string[];
  highlightTitle: string;
  highlights: { title: string; body: string }[];
};

function DayCard({
  label,
  date,
  schedule,
  theme,
  lead,
  audienceTitle,
  audience,
  deliversTitle,
  delivers,
  highlightTitle,
  highlights,
}: DayCardProps) {
  return (
    <article className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-8 md:p-10">
      <div>
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
          {label} · {schedule}
        </span>
        <h3 className="mt-3 font-display text-3xl font-medium leading-tight md:text-4xl">
          {theme}
        </h3>
        <p className="mt-1 text-sm text-muted">{date}</p>
        <p className="mt-4 text-base leading-relaxed text-fg/85">{lead}</p>
      </div>

      <div className="grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            {audienceTitle}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-fg/90">
            {audience.map((item) => (
              <li key={item} className="leading-relaxed">
                · {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            {deliversTitle}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-fg/90">
            {delivers.map((item) => (
              <li key={item} className="leading-relaxed">
                · {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
          {highlightTitle}
        </p>
        <ul className="mt-3 space-y-3">
          {highlights.map((h, i) => (
            <li key={i} className="text-sm leading-relaxed text-fg/90">
              {h.title && (
                <span className="font-display font-medium text-fg">{h.title}: </span>
              )}
              {h.body}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
