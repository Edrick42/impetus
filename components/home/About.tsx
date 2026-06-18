import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';

type Value = { title: string; body: string };

export function About() {
  const t = useTranslations('about');
  const manifestoLines = t.raw('manifesto.lines') as string[];
  const values = t.raw('values.items') as Value[];

  return (
    <>
      {/* HERO */}
      <Section id="sobre" tone="surface">
        <Container>
          <div className="max-w-4xl">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading level="display" className="mt-4">
              {t('title')}
            </Heading>
            <Lead className="mt-8 max-w-3xl">{t('lead')}</Lead>
          </div>
        </Container>
      </Section>

      {/* MANIFESTO */}
      <Section tone="dark">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Eyebrow className="text-bg/70">{t('manifesto.eyebrow')}</Eyebrow>
            <div className="mt-8 space-y-6">
              {manifestoLines.map((line, i) => (
                <p
                  key={i}
                  className="font-display text-2xl font-medium leading-snug text-bg md:text-3xl"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* PURPOSE + VISION */}
      <Section tone="default">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <article>
              <Eyebrow>{t('purpose.title')}</Eyebrow>
              <p className="mt-6 text-lg leading-relaxed text-fg/90 md:text-xl">
                {t('purpose.body')}
              </p>
            </article>
            <article>
              <Eyebrow>{t('vision.title')}</Eyebrow>
              <p className="mt-6 text-lg leading-relaxed text-fg/90 md:text-xl">
                {t('vision.body')}
              </p>
            </article>
          </div>
        </Container>
      </Section>

      {/* VALUES */}
      <Section tone="surface">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{t('values.eyebrow')}</Eyebrow>
            <Heading className="mt-4">{t('values.title')}</Heading>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-x-12 lg:grid-cols-3">
            {values.map((value, i) => (
              <article
                key={value.title}
                className="border-t border-border pt-6"
              >
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
                  0{i + 1}
                </p>
                <h3 className="mt-3 font-display text-xl font-medium leading-tight">
                  {value.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* DIFFERENTIATION */}
      <Section tone="default">
        <Container>
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
            <div>
              <Eyebrow>{t('differentiation.eyebrow')}</Eyebrow>
              <Heading className="mt-4">{t('differentiation.title')}</Heading>
            </div>
            <p className="text-lg leading-relaxed text-fg/85 md:text-xl">
              {t('differentiation.body')}
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
