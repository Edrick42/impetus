import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Heading';
import { ButtonLink } from '@/components/ui/Button';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden bg-bg pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-36">
      <Container>
        <div className="max-w-4xl">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mt-6 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            {t('subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/#eventos" variant="primary">
              {t('ctaPrimary')}
            </ButtonLink>
            <ButtonLink href="/#sobre" variant="ghost">
              {t('ctaSecondary')}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
