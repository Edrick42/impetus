import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { CONTACT, formatAddressLines } from '@/lib/contact';

export function Contact() {
  const t = useTranslations('contact');
  const addressLines = formatAddressLines();

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
                href={`mailto:${CONTACT.email}`}
                className="mt-2 inline-block font-display text-2xl font-medium tracking-tight text-fg hover:text-brand"
              >
                {CONTACT.email}
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                {t('phoneLabel')}
              </p>
              <a
                href={`tel:${CONTACT.phone.tel}`}
                className="mt-2 inline-block font-display text-2xl font-medium tracking-tight text-fg hover:text-brand"
              >
                {CONTACT.phone.display}
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                {t('addressLabel')}
              </p>
              <address className="mt-2 not-italic text-base leading-relaxed text-fg">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                {t('social')}
              </p>
              <div className="mt-3 flex gap-4 text-sm">
                <a
                  href={CONTACT.social.instagram}
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
