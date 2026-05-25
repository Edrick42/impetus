'use client';

declare global {
  interface Window {
    clarity?: (
      action: string,
      ...args: (string | Record<string, unknown>)[]
    ) => void;
  }
}

/**
 * Dispara evento customizado no Microsoft Clarity.
 * Silenciosamente no-op se Clarity não estiver carregado (dev, sem env var, ad-block).
 */
export function trackEvent(name: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (typeof window.clarity !== 'function') return;
  try {
    window.clarity('event', name);
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        window.clarity('set', key, String(value));
      }
    }
  } catch {
    // silencioso — telemetria nunca quebra UX
  }
}
