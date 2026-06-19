import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { hasGallery } from '@/lib/env';
import type { Locale } from '@/i18n/routing';

export default async function PhotographerHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const user = await requireRole(locale, 'photographer');
  const t = await getTranslations('photographer');

  if (!hasGallery) {
    return (
      <Container className="py-16">
        <p className="text-muted">{t('unconfigured')}</p>
      </Container>
    );
  }

  const supabase = await createClient();

  // Admin vê todos; fotógrafo só os atribuídos
  const baseSelect = supabase.from('events').select(
    'id, slug, name, event_date, published, photos(count)',
  );

  const { data: events } =
    user.role === 'admin'
      ? await baseSelect.order('event_date', { ascending: false })
      : await baseSelect
          .in(
            'id',
            (
              await supabase
                .from('event_photographers')
                .select('event_id')
                .eq('user_id', user.id)
            ).data?.map((r) => r.event_id) ?? [],
          )
          .order('event_date', { ascending: false });

  return (
    <Container className="py-16 md:py-20">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <Heading level="section" className="mt-4">
        {t('title')}
      </Heading>
      <Lead className="mt-4">{t('lead')}</Lead>

      <div className="mt-12">
        {!events || events.length === 0 ? (
          <p className="text-muted">{t('emptyEvents')}</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {events.map((ev) => {
              const photoCount = (ev.photos?.[0]?.count as number | undefined) ?? 0;
              return (
                <li key={ev.id}>
                  <Link
                    href={`/${locale}/fotografo/${ev.slug}`}
                    className="block rounded-lg border border-border bg-bg p-5 transition-colors hover:border-brand"
                  >
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{ev.event_date ?? ''}</span>
                      <span>
                        {ev.published ? t('badgePublished') : t('badgeDraft')}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-xl">{ev.name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {t('photoCount', { count: photoCount })}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Container>
  );
}
