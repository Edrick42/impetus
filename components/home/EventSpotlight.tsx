import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Heading';
import { FAVELA_RICA } from '@/lib/event';

type Highlight = { number: string; label: string };

export function EventSpotlight() {
  const t = useTranslations('home');
  const events = useTranslations('events');
  const highlights = t.raw('eventHighlights') as Highlight[];
  const bannerAlt = `${events('title')} · ${events('tagline')}`;

  return (
    <Section tone="default">
      <Container>
        <Eyebrow>{t('eventEyebrow')}</Eyebrow>

        <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FAVELA_RICA.bannerSrc}
            alt={bannerAlt}
            width={1376}
            height={768}
            className="block h-auto w-full"
          />
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                {t('eventDateLabel')}
              </p>
              <p className="mt-1 font-display text-xl font-medium">
                {events('date')}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                {t('eventVenueLabel')}
              </p>
              <p className="mt-1 font-display text-xl font-medium">
                {events('venueName')}
              </p>
              <p className="text-xs text-muted">{events('location')}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={FAVELA_RICA.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-medium text-brand-fg transition-opacity hover:opacity-90"
            >
              {t('eventCtaPrimary')}
            </a>
            <Link
              href="/eventos"
              className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-5 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface"
            >
              {t('eventCtaSecondary')}
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
          {highlights.map((h) => (
            <li key={h.label}>
              <p className="font-display text-3xl font-medium text-brand md:text-4xl">
                {h.number}
              </p>
              <p className="mt-2 text-sm leading-snug text-muted md:text-base">
                {h.label}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
