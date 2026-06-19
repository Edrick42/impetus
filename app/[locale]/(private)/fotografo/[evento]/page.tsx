import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading } from '@/components/ui/Heading';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { publicUrl } from '@/lib/r2';
import { hasGallery } from '@/lib/env';
import type { Locale } from '@/i18n/routing';
import { Uploader } from './Uploader';
import { DeletePhotoButton } from './DeletePhotoButton';

export default async function PhotographerEventPage({
  params,
}: {
  params: Promise<{ locale: string; evento: string }>;
}) {
  const { locale: rawLocale, evento } = await params;
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

  const { data: event } = await supabase
    .from('events')
    .select('id, slug, name, event_date, published')
    .eq('slug', evento)
    .single();

  if (!event) notFound();

  // Validar atribuição (admin escapa)
  if (user.role !== 'admin') {
    const { data: assignment } = await supabase
      .from('event_photographers')
      .select('event_id')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .maybeSingle();
    if (!assignment) notFound();
  }

  const { data: photos } = await supabase
    .from('photos')
    .select('id, r2_key_thumb, uploaded_by, caption, uploaded_at')
    .eq('event_id', event.id)
    .order('uploaded_at', { ascending: false });

  return (
    <Container className="py-16 md:py-20">
      <Link
        href={`/${locale}/fotografo`}
        className="text-sm text-muted hover:text-brand"
      >
        {t('back')}
      </Link>

      <Eyebrow className="mt-6">{event.event_date ?? ''}</Eyebrow>
      <Heading level="section" className="mt-2">
        {event.name}
      </Heading>
      <p className="mt-4 text-sm text-muted">
        {event.published ? t('badgePublished') : t('badgeDraft')}
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl">{t('uploadTitle')}</h2>
        <p className="mt-2 text-sm text-muted">{t('uploadHint')}</p>
        <div className="mt-6">
          <Uploader eventSlug={event.slug} />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl">
          {t('myPhotosTitle', { count: photos?.length ?? 0 })}
        </h2>

        {!photos || photos.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t('emptyPhotos')}</p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {photos.map((p) => (
              <li key={p.id} className="group relative aspect-square overflow-hidden rounded-md bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicUrl(p.r2_key_thumb)}
                  alt={p.caption ?? ''}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {p.uploaded_by === user.id || user.role === 'admin' ? (
                  <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <DeletePhotoButton photoId={p.id} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
