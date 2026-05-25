import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { env } from '@/lib/env';

export function Contact() {
  const t = useTranslations('contact');
  const email = env.NEXT_PUBLIC_CONTACT_EMAIL;

  return (
    <Section id="contato" tone="surface">
      <Container>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <Heading level="display" className="mt-4">
              {t('title')}
            </Heading>
            <Lead className="mt-6">{t('lead')}</Lead>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                {t('emailLabel')}
              </p>
              <a
                href={`mailto:${email}`}
                className="mt-2 inline-block font-display text-2xl font-medium tracking-tight text-fg hover:text-brand"
              >
                {email}
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                {t('social')}
              </p>
              <div className="mt-3 flex gap-4 text-sm">
                <a
                  href="https://instagram.com/institutoimpetus"
                  className="text-fg hover:text-brand"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
