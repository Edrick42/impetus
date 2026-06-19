import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { requireUser } from '@/lib/auth';
import { signOutAction } from '../entrar/actions';
import type { Locale } from '@/i18n/routing';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PrivateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const user = await requireUser(locale);
  const t = await getTranslations('privateNav');

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-[60vh]">
      <nav className="border-b border-border bg-surface/60">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4 text-sm">
          <div className="flex flex-wrap items-center gap-5">
            {isAdmin ? (
              <>
                <Link href={`/${locale}/admin`} className="font-medium hover:text-brand">
                  {t('adminHome')}
                </Link>
                <Link href={`/${locale}/admin/eventos`} className="hover:text-brand">
                  {t('adminEvents')}
                </Link>
                <Link href={`/${locale}/admin/fotografos`} className="hover:text-brand">
                  {t('adminPhotographers')}
                </Link>
              </>
            ) : null}
            <Link href={`/${locale}/fotografo`} className="hover:text-brand">
              {t('photographerHome')}
            </Link>
          </div>
          <div className="flex items-center gap-4 text-muted">
            <span className="hidden sm:inline">{user.email}</span>
            <form
              action={async () => {
                'use server';
                await signOutAction(locale);
              }}
            >
              <button type="submit" className="hover:text-brand">
                {t('signOut')}
              </button>
            </form>
          </div>
        </Container>
      </nav>
      {children}
    </div>
  );
}
