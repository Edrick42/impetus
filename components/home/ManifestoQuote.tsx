import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Heading';

export function ManifestoQuote() {
  const t = useTranslations('home');

  return (
    <Section tone="dark">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow className="text-bg/70">{t('quoteEyebrow')}</Eyebrow>
          <blockquote className="mt-8 font-display text-3xl font-medium leading-tight text-bg md:text-5xl lg:text-6xl">
            &ldquo;{t('quoteLine')}&rdquo;
          </blockquote>
          <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-bg/60">
            — {t('quoteAuthor')}
          </p>
        </div>
      </Container>
    </Section>
  );
}
