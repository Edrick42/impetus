import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading } from '@/components/ui/Heading';
import { ButtonLink } from '@/components/ui/Button';

export function AboutSummary() {
  const t = useTranslations('home');

  return (
    <Section tone="surface">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
          <div>
            <Eyebrow>{t('aboutEyebrow')}</Eyebrow>
            <Heading className="mt-4">{t('aboutTitle')}</Heading>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-fg/85 md:text-xl">
              {t('aboutBody')}
            </p>
            <div className="mt-8">
              <ButtonLink href="/sobre" variant="ghost">
                {t('aboutCta')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
