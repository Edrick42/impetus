import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  // Mantém os cookies de sessão do Supabase rotacionados sem bloquear a rota.
  // A proteção real (redirect para /entrar) acontece nos requireUser/requireRole.
  await updateSession(request, response);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
