import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';

type ImpactItem = { number: string; label: string };

export function Impact() {
  const t = useTranslations('home');
  const items = t.raw('impactItems') as ImpactItem[];

  return (
    <Section tone="surface">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{t('impactEyebrow')}</Eyebrow>
          <Heading className="mt-4">{t('impactTitle')}</Heading>
          <Lead className="mt-6">{t('impactLead')}</Lead>
        </div>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.label} className="border-t border-border pt-6">
              <p className="font-display text-5xl font-medium leading-none text-brand md:text-6xl">
                {item.number}
              </p>
              <p className="mt-4 text-base leading-snug text-fg/85 md:text-lg">
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
