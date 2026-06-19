import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { Eyebrow, Heading, Lead } from '@/components/ui/Heading';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { hasGallery, hasSupabaseAdmin } from '@/lib/env';
import type { Locale } from '@/i18n/routing';
import { CreatePhotographerForm } from './CreatePhotographerForm';
import { AssignEventsForm } from './AssignEventsForm';

export default async function AdminPhotographersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations('admin.photographers');

  if (!hasGallery || !hasSupabaseAdmin) {
    return (
      <Container className="py-16">
        <p className="text-muted">{t('unconfigured')}</p>
      </Container>
    );
  }

  const supabase = await createClient();
  const { data: events } = await supabase
    .from('events')
    .select('id, name')
    .order('event_date', { ascending: false });

  const adminClient = createAdminClient();
  const { data: usersList } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  const photographers = (usersList?.users ?? []).filter(
    (u) => u.app_metadata?.role === 'photographer',
  );

  const { data: assignments } = await supabase
    .from('event_photographers')
    .select('event_id, user_id');

  const assignmentsByUser = new Map<string, string[]>();
  (assignments ?? []).forEach((a) => {
    const prev = assignmentsByUser.get(a.user_id) ?? [];
    prev.push(a.event_id);
    assignmentsByUser.set(a.user_id, prev);
  });

  const eventOptions = (events ?? []).map((e) => ({ id: e.id, name: e.name }));

  return (
    <Container className="py-16 md:py-20">
      <Eyebrow>{t('eyebrow')}</Eyebrow>
      <Heading level="section" className="mt-4">
        {t('title')}
      </Heading>
      <Lead className="mt-4">{t('lead')}</Lead>

      <section className="mt-12 rounded-lg border border-border bg-surface/40 p-6">
        <h2 className="font-display text-xl">{t('createTitle')}</h2>
        <p className="mt-2 text-sm text-muted">{t('createHint')}</p>
        <div className="mt-6">
          <CreatePhotographerForm events={eventOptions} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl">{t('listTitle')}</h2>

        {photographers.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{t('emptyList')}</p>
        ) : (
          <ul className="mt-6 grid gap-3">
            {photographers.map((u) => (
              <li key={u.id}>
                <AssignEventsForm
                  userId={u.id}
                  email={u.email ?? '—'}
                  events={eventOptions}
                  assignedIds={assignmentsByUser.get(u.id) ?? []}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
