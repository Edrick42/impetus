import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading } from '@/components/ui/Heading';
import { ButtonLink } from '@/components/ui/Button';

export function ClosingCta() {
  const t = useTranslations('home');

  return (
    <Section tone="dark">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="text-bg/70">{t('ctaEyebrow')}</Eyebrow>
          <Heading level="display" className="mt-4 text-bg">
            {t('ctaTitle')}
          </Heading>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-bg/80 md:text-xl">
            {t('ctaLead')}
          </p>
          <div className="mt-10 flex justify-center">
            <ButtonLink href="/contato" variant="primary">
              {t('ctaButton')}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
