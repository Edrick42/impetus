import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { SignInForm } from './SignInForm';
import { hasSupabase } from '@/lib/env';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'signIn' });
  return {
    title: t('title'),
    robots: { index: false, follow: false },
  };
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ denied?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { denied } = await searchParams;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations('signIn');

  return (
    <Container className="py-20 md:py-28">
      <div className="mx-auto max-w-md">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <Heading level="section" className="mt-4">
          {t('title')}
        </Heading>
        <Lead className="mt-4">{t('lead')}</Lead>

        {hasSupabase ? (
          <SignInForm locale={locale} denied={Boolean(denied)} />
        ) : (
          <p className="mt-10 rounded-md border border-border bg-surface p-4 text-sm text-muted">
            {t('unconfigured')}
          </p>
        )}
      </div>
    </Container>
  );
}
