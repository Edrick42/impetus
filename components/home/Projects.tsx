import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { ButtonLink } from '@/components/ui/Button';

const ITEMS = [
  { key: 'magistraturaNegra', href: '/projetos/magistratura-negra' as const },
  { key: 'favelaRica', href: '/eventos' as const },
  { key: 'aprenderComImpetus', href: null },
] as const;

type ProjectsProps = { withCta?: boolean };

export function Projects({ withCta = false }: ProjectsProps = {}) {
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
          {ITEMS.map(({ key, href }) => {
            const tag = t(`items.${key}.tag`);
            const title = t(`items.${key}.title`);
            const body = t(`items.${key}.body`);
            const cardClasses =
              'group flex h-full flex-col gap-4 rounded-lg border border-border bg-bg p-8 transition-shadow hover:shadow-md';

            const content = (
              <>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
                  {tag}
                </span>
                <h3 className="font-display text-2xl font-medium leading-tight group-hover:text-brand">
                  {title}
                </h3>
                <p className="text-base leading-relaxed text-muted">{body}</p>
                {href && (
                  <p className="mt-auto pt-4 text-sm font-medium text-brand">
                    →
                  </p>
                )}
              </>
            );

            return href ? (
              <Link key={key} href={href} className={cardClasses}>
                {content}
              </Link>
            ) : (
              <article key={key} className={cardClasses}>
                {content}
              </article>
            );
          })}
        </div>

        {withCta && (
          <div className="mt-12 flex justify-center">
            <ButtonLink href="/projetos" variant="ghost">
              {t('cta')}
            </ButtonLink>
          </div>
        )}
      </Container>
    </Section>
  );
}
