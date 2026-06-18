import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { CONTACT, formatAddressLines } from '@/lib/contact';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const contact = useTranslations('contact');
  const meta = useTranslations('metadata');
  const year = new Date().getFullYear();
  const addressLines = formatAddressLines();

  return (
    <footer className="border-t border-border bg-surface py-16">
      <Container className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-horizontal.svg"
            alt={meta('siteName')}
            className="h-12 w-auto"
            width={246}
            height={48}
          />
          <p className="mt-4 text-sm text-muted">{t('tagline')}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            {contact('addressLabel')}
          </p>
          <address className="mt-3 not-italic text-sm leading-relaxed text-fg">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              {contact('emailLabel')}
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-2 inline-block text-sm text-fg hover:text-brand"
            >
              {CONTACT.email}
            </a>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              {contact('phoneLabel')}
            </p>
            <a
              href={`tel:${CONTACT.phone.tel}`}
              className="mt-2 inline-block text-sm text-fg hover:text-brand"
            >
              {CONTACT.phone.display}
            </a>
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Link href="/" className="text-muted hover:text-fg">
            {nav('home')}
          </Link>
          <Link href="/sobre" className="text-muted hover:text-fg">
            {nav('about')}
          </Link>
          <Link href="/projetos" className="text-muted hover:text-fg">
            {nav('projects')}
          </Link>
          <Link href="/eventos" className="text-muted hover:text-fg">
            {nav('events')}
          </Link>
          <Link href="/galeria" className="text-muted hover:text-fg">
            {nav('gallery')}
          </Link>
          <Link href="/contato" className="text-muted hover:text-fg">
            {nav('contact')}
          </Link>
        </nav>
      </Container>

      <Container className="mt-12 border-t border-border pt-8 text-sm text-muted">
        <p>{t('rights', { year })}</p>
      </Container>
    </footer>
  );
}
