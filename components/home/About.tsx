import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';

const PILLARS = ['mission', 'vision', 'values'] as const;

export function About() {
  const t = useTranslations('about');

  return (
    <Section id="sobre" tone="surface">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <Heading className="mt-4">{t('title')}</Heading>
          <Lead className="mt-6">{t('lead')}</Lead>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {PILLARS.map((key) => (
            <div key={key} className="border-t border-border pt-6">
              <h3 className="font-display text-xl font-medium">
                {t(`pillars.${key}.title`)}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {t(`pillars.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
