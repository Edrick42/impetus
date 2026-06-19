import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/env';

export type Role = 'admin' | 'photographer';

export type SessionUser = {
  id: string;
  email: string | null;
  role: Role | null;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!hasSupabase) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const role = (user.app_metadata?.role ?? null) as Role | null;
  return { id: user.id, email: user.email ?? null, role };
}

export async function requireUser(locale: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/entrar`);
  return user;
}

export async function requireRole(locale: string, role: Role): Promise<SessionUser> {
  const user = await requireUser(locale);
  if (user.role !== role && user.role !== 'admin') {
    redirect(`/${locale}/entrar?denied=1`);
  }
  return user;
}

export async function requireAdmin(locale: string): Promise<SessionUser> {
  const user = await requireUser(locale);
  if (user.role !== 'admin') redirect(`/${locale}/entrar?denied=1`);
  return user;
}
