import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const meta = useTranslations('metadata');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-16">
      <Container className="grid gap-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-medium tracking-tight">
            {meta('siteName')}
          </p>
          <p className="mt-2 text-sm text-muted">{t('tagline')}</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm">
          <Link href="/" className="text-muted hover:text-fg">
            {nav('home')}
          </Link>
          <Link href="/blog" className="text-muted hover:text-fg">
            {nav('blog')}
          </Link>
          <Link href="/galeria" className="text-muted hover:text-fg">
            {nav('gallery')}
          </Link>
          <Link href="/#contato" className="text-muted hover:text-fg">
            {nav('contact')}
          </Link>
        </nav>

        <div className="text-sm text-muted">
          <p>{t('rights', { year })}</p>
        </div>
      </Container>
    </footer>
  );
}
