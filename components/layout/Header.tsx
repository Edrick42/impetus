import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('nav');
  const meta = useTranslations('metadata');

  const links = [
    { href: '/', label: t('home') },
    { href: '/sobre', label: t('about') },
    { href: '/projetos', label: t('projects') },
    { href: '/eventos', label: t('events') },
    { href: '/galeria', label: t('gallery') },
    { href: '/contato', label: t('contact') },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-6 md:h-24">
        <Link href="/" aria-label={meta('siteName')} className="block shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.svg"
            alt={meta('siteName')}
            className="h-14 w-14 md:h-16 md:w-16"
            width={64}
            height={64}
          />
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
