import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';

const ITEMS = ['favelaRica', 'educacao', 'empreender'] as const;

export function Projects() {
  const t = useTranslations('projects');

  return (
    <Section id="projetos">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <Heading className="mt-4">{t('title')}</Heading>
          <Lead className="mt-6">{t('lead')}</Lead>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {ITEMS.map((key) => (
            <article
              key={key}
              className="group flex flex-col gap-4 rounded-lg border border-border bg-bg p-8 transition-shadow hover:shadow-md"
            >
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
                {t(`items.${key}.tag`)}
              </span>
              <h3 className="font-display text-2xl font-medium leading-tight">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-base leading-relaxed text-muted">
                {t(`items.${key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
