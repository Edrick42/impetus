import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { requireAdmin } from '@/lib/auth';
import type { Locale } from '@/i18n/routing';

export default async function AdminHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations('admin');

  return (
    <Container className="py-16 md:py-20">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <Heading level="section" className="mt-4">
        {t('title')}
      </Heading>
      <Lead className="mt-4">{t('lead')}</Lead>

      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        <li>
          <Link
            href={`/${locale}/admin/eventos`}
            className="block rounded-lg border border-border bg-surface/40 p-6 transition-colors hover:border-brand"
          >
            <h2 className="font-display text-xl">{t('cardEvents')}</h2>
            <p className="mt-2 text-sm text-muted">{t('cardEventsBody')}</p>
          </Link>
        </li>
        <li>
          <Link
            href={`/${locale}/admin/fotografos`}
            className="block rounded-lg border border-border bg-surface/40 p-6 transition-colors hover:border-brand"
          >
            <h2 className="font-display text-xl">{t('cardPhotographers')}</h2>
            <p className="mt-2 text-sm text-muted">{t('cardPhotographersBody')}</p>
          </Link>
        </li>
      </ul>
    </Container>
  );
}
