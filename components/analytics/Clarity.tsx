import Script from 'next/script';
import { env, hasClarity } from '@/lib/env';

/**
 * Microsoft Clarity — heatmap, session replay e analytics comportamental.
 * Carrega apenas em produção, com strategy afterInteractive (não bloqueia LCP).
 * Documentação: https://clarity.microsoft.com/
 */
export function Clarity() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd || !hasClarity) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}
