import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading } from '@/components/ui/Heading';
import { ButtonLink } from '@/components/ui/Button';

export function Events() {
  const t = useTranslations('events');

  return (
    <Section id="eventos" tone="dark">
      <Container>
        <div className="grid items-end gap-12 md:grid-cols-2">
          <div>
            <Eyebrow className="text-bg/70">{t('eyebrow')}</Eyebrow>
            <Heading level="display" className="mt-4 text-bg">
              {t('title')}
            </Heading>
            <div className="mt-8 flex flex-wrap gap-8 text-sm">
              <div>
                <p className="text-bg/60 uppercase tracking-[0.16em] text-xs">Data</p>
                <p className="mt-1 text-bg">{t('date')}</p>
              </div>
              <div>
                <p className="text-bg/60 uppercase tracking-[0.16em] text-xs">Local</p>
                <p className="mt-1 text-bg">{t('location')}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-bg/80">{t('body')}</p>
            <div className="mt-8">
              <ButtonLink href="/galeria" variant="primary">
                {t('cta')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
