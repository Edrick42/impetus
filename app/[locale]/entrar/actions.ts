'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/env';

export type SignInResult = { error: string } | undefined;

export async function signInAction(
  _prev: SignInResult,
  formData: FormData,
): Promise<SignInResult> {
  if (!hasSupabase) {
    return { error: 'Login indisponível: galeria ainda não configurada.' };
  }
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const locale = String(formData.get('locale') ?? 'pt');

  if (!email || !password) {
    return { error: 'Informe e-mail e senha.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: 'Credenciais inválidas.' };
  }

  const role = data.user.app_metadata?.role;
  if (role === 'admin') redirect(`/${locale}/admin`);
  if (role === 'photographer') redirect(`/${locale}/fotografo`);

  // Logou mas não tem role definida — pode ser o primeiro admin antes da config
  redirect(`/${locale}`);
}

export async function signOutAction(locale: string): Promise<void> {
  if (hasSupabase) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect(`/${locale}/entrar`);
}
