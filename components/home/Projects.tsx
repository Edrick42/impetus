import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import { ButtonLink } from '@/components/ui/Button';
import { FAVELA_RICA } from '@/lib/event';

type MnResult = { number: string; label: string };
type ProjectsProps = { withCta?: boolean };

export function Projects({ withCta = false }: ProjectsProps = {}) {
  const t = useTranslations('projects');
  const events = useTranslations('events');
  const home = useTranslations('home');
  const mn = useTranslations('magistraturaNegra');
  const mnResults = (mn.raw('results.items') as MnResult[]).slice(0, 4);

  return (
    <>
      {/* MAGISTRATURA NEGRA */}
      <Section id="projetos" tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
                01 · {t('items.magistraturaNegra.tag')}
              </span>
              <Heading className="mt-4">
                {t('items.magistraturaNegra.title')}
              </Heading>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/85 md:text-xl">
                {t('items.magistraturaNegra.body')}
              </p>
              <div className="mt-10">
                <Link
                  href="/projetos/magistratura-negra"
                  className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-medium text-brand-fg transition-opacity hover:opacity-90"
                >
                  {t('detailsCta')} →
                </Link>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-8 self-start rounded-lg border border-border bg-bg p-8">
              {mnResults.map((item) => (
                <li key={item.label}>
                  <p className="font-display text-3xl font-medium leading-none text-brand md:text-4xl">
                    {item.number}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-muted md:text-base">
                    {item.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* FAVELA + RICA */}
      <Section tone="default">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
                02 · {t('items.favelaRica.tag')}
              </span>
              <Heading className="mt-4">{t('items.favelaRica.title')}</Heading>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/85 md:text-xl">
                {t('items.favelaRica.body')}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/eventos"
                  className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-medium text-brand-fg transition-opacity hover:opacity-90"
                >
                  {t('favelaRicaCta')} →
                </Link>
                <a
                  href={FAVELA_RICA.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-5 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface"
                >
                  {events('ctaRegister')}
                </a>
              </div>
            </div>

            <div className="self-start overflow-hidden rounded-lg border border-border bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FAVELA_RICA.bannerSrc}
                alt={`${events('title')} · ${events('tagline')}`}
                width={1376}
                height={768}
                className="block h-auto w-full"
              />
              <div className="grid grid-cols-2 gap-4 p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                    {home('eventDateLabel')}
                  </p>
                  <p className="mt-1 font-display text-lg font-medium">
                    {events('date')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                    {home('eventVenueLabel')}
                  </p>
                  <p className="mt-1 font-display text-lg font-medium">
                    {events('venueName')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* APRENDER COM IMPETUS */}
      <Section tone="surface">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
                03 · {t('items.aprenderComImpetus.tag')}
              </span>
              <Heading className="mt-4">
                {t('items.aprenderComImpetus.title')}
              </Heading>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/85 md:text-xl">
                {t('items.aprenderComImpetus.body')}
              </p>
              <div className="mt-10 inline-flex items-center gap-3 rounded-md border border-border bg-bg px-5 py-3 text-sm text-muted">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 rounded-full bg-accent-yellow"
                />
                {t('comingSoon')}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {withCta && (
        <Section tone="default" className="!py-12 md:!py-16">
          <Container className="flex justify-center">
            <ButtonLink href="/projetos" variant="ghost">
              {t('cta')}
            </ButtonLink>
          </Container>
        </Section>
      )}
    </>
  );
}
