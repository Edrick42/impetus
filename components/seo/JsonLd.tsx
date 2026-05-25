type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Injeta structured data como <script type="application/ld+json">.
 * Aceita um objeto ou array de objetos schema.org.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify é seguro aqui — o conteúdo vem de builders tipados em lib/seo.ts
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
