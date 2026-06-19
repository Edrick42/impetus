import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading } from '@/components/ui/Heading';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { hasGallery } from '@/lib/env';
import type { Locale } from '@/i18n/routing';
import { CreateEventForm } from './CreateEventForm';
import { EventRowActions } from './EventRowActions';
import { togglePublishedAction, deleteEventAction } from './actions';

export default async function AdminEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations('admin.events');

  if (!hasGallery) {
    return (
      <Container className="py-16">
        <p className="text-muted">{t('unconfigured')}</p>
      </Container>
    );
  }

  const supabase = await createClient();
  const { data: events } = await supabase
    .from('events')
    .select('id, slug, name, event_date, published, photos(count)')
    .order('event_date', { ascending: false });

  return (
    <Container className="py-16 md:py-20">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <Heading level="section" className="mt-4">
        {t('title')}
      </Heading>

      <section className="mt-12 rounded-lg border border-border bg-surface/40 p-6">
        <h2 className="font-display text-xl">{t('createTitle')}</h2>
        <div className="mt-6">
          <CreateEventForm locale={locale} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl">{t('listTitle')}</h2>

        {!events || events.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t('emptyList')}</p>
        ) : (
          <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-bg">
            {events.map((ev) => {
              const photoCount = (ev.photos?.[0]?.count as number | undefined) ?? 0;
              return (
                <li key={ev.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div>
                    <Link
                      href={`/${locale}/fotografo/${ev.slug}`}
                      className="font-display text-lg hover:text-brand"
                    >
                      {ev.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {ev.slug} · {ev.event_date ?? '—'} · {t('photoCount', { count: photoCount })}
                    </p>
                  </div>
                  <EventRowActions
                    locale={locale}
                    eventId={ev.id}
                    published={ev.published}
                    togglePublishedAction={togglePublishedAction}
                    deleteEventAction={deleteEventAction}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Container>
  );
}
