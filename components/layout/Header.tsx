import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const meta = useTranslations('metadata');

  const links = [
    { href: '/#sobre', label: t('about') },
    { href: '/#projetos', label: t('projects') },
    { href: '/#eventos', label: t('events') },
    { href: '/blog', label: t('blog') },
    { href: '/galeria', label: t('gallery') },
    { href: '/#contato', label: t('contact') },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-tight"
          aria-label={meta('siteName')}
        >
          {meta('siteName')}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <LanguageSwitcher />
      </Container>
    </header>
  );
}
