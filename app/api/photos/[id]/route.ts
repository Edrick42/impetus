import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteObject } from '@/lib/r2';
import { hasGallery } from '@/lib/env';

export const runtime = 'nodejs';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!hasGallery) {
    return NextResponse.json({ error: 'gallery_not_configured' }, { status: 503 });
  }
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: photo, error: getErr } = await supabase
    .from('photos')
    .select('id, uploaded_by, r2_key_thumb, r2_key_medium, r2_key_original')
    .eq('id', id)
    .single();

  if (getErr || !photo) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const isAdmin = user.app_metadata?.role === 'admin';
  if (photo.uploaded_by !== user.id && !isAdmin) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  // RLS já protege, mas deletamos com o cliente do usuário para auditabilidade
  const { error: delErr } = await supabase.from('photos').delete().eq('id', id);
  if (delErr) {
    return NextResponse.json({ error: 'db_delete_failed' }, { status: 500 });
  }

  // R2 best-effort
  await Promise.all([
    deleteObject(photo.r2_key_thumb).catch(() => undefined),
    deleteObject(photo.r2_key_medium).catch(() => undefined),
    deleteObject(photo.r2_key_original).catch(() => undefined),
  ]);

  return NextResponse.json({ ok: true });
}
