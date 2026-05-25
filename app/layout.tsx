import type { ReactNode } from 'react';

/**
 * Root layout — pass-through.
 * Toda a renderização real acontece em app/[locale]/layout.tsx,
 * que define <html> com o lang correto. Este existe apenas para
 * satisfazer a estrutura do App Router.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
