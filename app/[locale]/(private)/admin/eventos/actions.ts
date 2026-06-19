'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const slugRe = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const createSchema = z.object({
  locale: z.string(),
  slug: z.string().min(2).max(80).regex(slugRe, 'slug inválido'),
  name: z.string().min(2).max(120),
  event_date: z.string().optional().or(z.literal('')),
  description: z.string().max(2000).optional().or(z.literal('')),
});

export type ActionResult = { error: string } | undefined;

export async function createEventAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const locale = String(formData.get('locale') ?? 'pt');
  await requireAdmin(locale);

  let parsed: z.infer<typeof createSchema>;
  try {
    parsed = createSchema.parse(Object.fromEntries(formData));
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'invalid' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('events').insert({
    slug: parsed.slug,
    name: parsed.name,
    description: parsed.description || null,
    event_date: parsed.event_date || null,
    published: false,
  });

  if (error) return { error: error.message };

  revalidatePath(`/${locale}/admin/eventos`);
  redirect(`/${locale}/admin/eventos`);
}

export async function togglePublishedAction(
  locale: string,
  eventId: string,
  next: boolean,
): Promise<void> {
  await requireAdmin(locale);
  const supabase = await createClient();
  await supabase.from('events').update({ published: next }).eq('id', eventId);
  revalidatePath(`/${locale}/admin/eventos`);
  revalidatePath(`/${locale}/galeria`);
}

export async function deleteEventAction(
  locale: string,
  eventId: string,
): Promise<void> {
  await requireAdmin(locale);
  const supabase = await createClient();
  await supabase.from('events').delete().eq('id', eventId);
  revalidatePath(`/${locale}/admin/eventos`);
}
