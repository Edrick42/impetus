# Instituto Impetus

Site institucional multilíngue (PT/EN/ES) do Instituto Impetus, patrocinador oficial do evento **Favela + Rica** (26-27/jun/2026).

Construído com Next.js 15, TypeScript, Tailwind CSS, next-intl e MDX. Estrutura desacoplada da identidade visual — quando a marca chegar, troca-se um arquivo de tokens (`app/globals.css`) e tudo acompanha.

---

## Setup

```bash
pnpm install
cp .env.local.example .env.local   # edite com seus valores
pnpm dev                            # localhost:3000
```

### Scripts

| Comando            | Descrição                                |
| ------------------ | ---------------------------------------- |
| `pnpm dev`         | Servidor de desenvolvimento              |
| `pnpm build`       | Build de produção                        |
| `pnpm start`       | Servir o build                           |
| `pnpm lint`        | ESLint                                   |
| `pnpm typecheck`   | TypeScript strict check (sem emissão)    |

---

## Estrutura

```
app/
├── [locale]/                    rotas localizadas (pt|en|es)
│   ├── layout.tsx               shell com Header, Footer, Clarity, providers
│   ├── page.tsx                 home com 8 seções
│   ├── blog/                    lista + post individual (MDX)
│   ├── galeria/                 lista de álbuns + álbum individual (Piwigo)
│   ├── opengraph-image.tsx      OG image dinâmica (Satori, edge runtime)
│   └── not-found.tsx
├── sitemap.ts                   sitemap dinâmico (rotas × locales × posts × álbuns)
├── robots.ts                    robots.txt
├── manifest.ts                  PWA manifest
└── globals.css                  ★ design tokens (única fonte de verdade da marca)

components/
├── analytics/Clarity.tsx        Microsoft Clarity script (afterInteractive, prod-only)
├── seo/JsonLd.tsx               injeção segura de structured data
├── layout/{Header,Footer,LanguageSwitcher}
├── home/{Hero,About,Projects,Events,GalleryPreview,InstagramFeed,BlogPreview,Contact}
├── blog/{PostCard,PostBody,ReadingProgress}
├── gallery/{AlbumGrid,PhotoGrid,Lightbox}
└── ui/{Container,Section,Heading,Button}

content/posts/{pt,en,es}/*.mdx   posts do blog (frontmatter + markdown)

lib/
├── piwigo.ts                    cliente Piwigo REST API + fallback com fotos mock
├── instagram.ts                 cliente Instagram Graph API (no-op se sem token)
├── mdx.ts                       loader de posts MDX
├── seo.ts                       buildMetadata + builders de JSON-LD
├── clarity.ts                   trackEvent helper
├── env.ts                       validação zod das env vars
└── utils.ts                     cn() helper (clsx + tailwind-merge)

messages/{pt,en,es}.json         strings de UI
i18n/{routing,request}.ts        config next-intl
middleware.ts                    roteamento i18n
```

---

## Variáveis de ambiente

Todas opcionais — o site funciona com fallbacks se nada for setado.

```bash
NEXT_PUBLIC_SITE_URL=https://institutoimpetus.org

# Piwigo (galeria) — cliente provê quando hospedagem estiver no ar
PIWIGO_API_URL=
PIWIGO_USERNAME=
PIWIGO_PASSWORD=

# Instagram Graph API (feed na home) — opcional
IG_ACCESS_TOKEN=
IG_USER_ID=

# Microsoft Clarity (heatmap + session replay) — produção
NEXT_PUBLIC_CLARITY_PROJECT_ID=

NEXT_PUBLIC_CONTACT_EMAIL=contato@institutoimpetus.org
```

Sem `PIWIGO_*`: galeria usa 2 álbuns mock com fotos do Pexels.
Sem `IG_*`: feed Instagram mostra placeholder com link.
Sem `NEXT_PUBLIC_CLARITY_PROJECT_ID`: Clarity não carrega.

---

## Como trocar a marca

Quando a identidade visual definitiva chegar:

1. Abrir `app/globals.css`
2. Atualizar os valores dentro de `:root`:
   - Cores: `--color-bg`, `--color-fg`, `--color-surface`, `--color-muted`, `--color-brand`, `--color-brand-fg`, `--color-border`
   - Fontes: substituir `Inter`/`Fraunces` no `app/[locale]/layout.tsx` (via `next/font/google` ou `next/font/local`)
3. Trocar `public/logo.png`, `public/favicon.ico` e `public/og-default.png` pelos arquivos oficiais
4. Pronto. Todos os componentes referenciam os tokens via Tailwind (`bg-brand`, `text-fg`, `font-display`) — nada para refatorar.

---

## Como adicionar um post

1. Criar `content/posts/pt/meu-slug.mdx` (e equivalentes em `en/` e `es/`)
2. Frontmatter obrigatório:
   ```yaml
   ---
   title: Título
   description: Resumo curto (vira meta description e OG)
   publishedAt: 2026-06-15
   author: Autor
   cover: /placeholders/blog/cover.jpg
   tags: [tag1, tag2]
   ---
   ```
3. Corpo em markdown. Salvar e o post aparece em `/pt/blog`, sitemap atualiza no próximo build.

---

## Como adicionar projeto/iniciativa

Hoje os 3 cards de projetos vêm de `messages/{locale}.json` em `projects.items`. Para adicionar:

1. Adicionar nova entrada (ex: `novoProj`) com `title`, `tag`, `body` em pt/en/es
2. Em `components/home/Projects.tsx`, incluir `'novoProj'` no array `ITEMS`

---

## SEO

Tudo embutido — não precisa de plugin:

- **Metadata por rota**: `generateMetadata` em todas as páginas dinâmicas
- **Structured data** (JSON-LD): `Organization`, `WebSite`, `Event` (Favela + Rica), `BlogPosting` (cada post), `BreadcrumbList`, `ImageGallery`
- **Sitemap dinâmico**: `/sitemap.xml` (rotas × 3 locales × posts × álbuns)
- **Robots**: `/robots.txt`
- **hreflang**: em todas as páginas via `alternates.languages` + sitemap
- **OG images dinâmicas**: `app/[locale]/opengraph-image.tsx` gera via Satori
- **Performance**: `next/image`, `next/font`, headers de cache

Validar após deploy:
- https://validator.schema.org
- https://search.google.com/test/rich-results
- Google Search Console + Bing Webmaster Tools

---

## Microsoft Clarity

Heatmaps, gravações de sessão e analytics comportamental. **Carrega apenas em produção** (`process.env.NODE_ENV === 'production'`) com `strategy="afterInteractive"` — zero impacto no LCP.

### Setup

1. Criar projeto em https://clarity.microsoft.com
2. Copiar o Project ID
3. Setar `NEXT_PUBLIC_CLARITY_PROJECT_ID` no ambiente de produção
4. Deploy

### Eventos customizados disparados

| Evento                | Quando                                         |
| --------------------- | ---------------------------------------------- |
| `language_switch`     | Usuário troca de idioma no header              |
| `download_photo`      | Baixa foto da galeria (botão no lightbox)      |
| `share_photo`         | Compartilha foto (Web Share API ou clipboard)  |
| `blog_post_complete`  | Rolou ≥95% de um post do blog                  |

Filtre as gravações no Clarity por esses eventos para entender o que funciona.

---

## Galeria

A galeria tem fluxo completo de fotógrafo com login, upload e publicação por
admin. Stack: **Supabase** (auth + Postgres + RLS) + **Cloudflare R2** (storage,
egress grátis) + **sharp** (gera thumb/medium/original no upload).

### Como ligar

1. **Supabase** — criar projeto, copiar URL + anon key + service role key, rodar a
   migration em `supabase/migrations/0001_gallery.sql` (ver `supabase/README.md`)
2. **Cloudflare R2** — criar bucket `impetus-gallery`, expor em domínio público
   (recomendado: custom domain `fotos.institutoimpetus.com.br`) e gerar API token
   com permissão de leitura+escrita
3. Preencher `.env.local` com todas as vars `NEXT_PUBLIC_SUPABASE_*`,
   `SUPABASE_SERVICE_ROLE_KEY`, `R2_*`
4. Criar o **primeiro admin** direto no Supabase Studio (Auth → Add user →
   editar `app_metadata` para `{"role": "admin"}`)
5. Logar em `/entrar`, criar evento em `/admin/eventos`, criar fotógrafo em
   `/admin/fotografos` (atribuindo ao evento), enviar credenciais ao fotógrafo
6. Fotógrafo loga, sobe fotos em `/fotografo/[evento]`
7. Admin volta em `/admin/eventos` e clica **Publicar** quando quiser liberar o
   álbum para visitantes

### Fallback

Enquanto Supabase/R2 não estão configurados, `lib/gallery.ts` usa o cliente
**Piwigo legado** (ou o mock de Pexels se Piwigo também não estiver setado).
A troca é automática via `hasGallery`/`hasPiwigo` em `lib/env.ts`.

---

## Acessibilidade

- 1 `<h1>` por página (estrutura validada)
- `alt` em toda `next/image`
- Skip link `Pular para o conteúdo` no topo de cada página
- Lightbox responde a teclado (←/→/Esc) e tem `role="dialog"` + `aria-modal`
- `:focus-visible` global com 2px outline brand
- `prefers-reduced-motion` respeitado
- Contraste AA mínimo nas combinações de tokens

---

## Stack

- **Next.js 15** (App Router)
- **TypeScript** strict
- **Tailwind CSS** + `@tailwindcss/typography`
- **next-intl** (i18n)
- **next-mdx-remote** (blog)
- **gray-matter** (frontmatter)
- **zod** (env validation)
- **clsx** + **tailwind-merge** (`cn` helper)
- **@supabase/ssr** (auth + DB)
- **@aws-sdk/client-s3** (Cloudflare R2 storage)
- **sharp** (processamento de imagem no upload)
- **react-dropzone** (upload drag-and-drop)

---

## Deploy

Recomendado: **Vercel**.

1. Push para repo GitHub
2. Conectar em vercel.com
3. Setar env vars em Project Settings → Environment Variables
4. Deploy automático em push

Preview deploys são criados por PR — ótimo para validar entregas com a Andréa antes do merge.

---

## Cronograma de referência (proposta)

| Data        | Marco                                                |
| ----------- | ---------------------------------------------------- |
| 22/mai/2026 | Kickoff + entrevista de marca                        |
| 29/mai/2026 | Apresentação de direções de marca                    |
| **10/jun**  | **Entrega 01: marca + site no ar**                   |
| 22/jun      | Galeria integrada ao Piwigo do cliente               |
| 26-27/jun   | Evento Favela + Rica — site + galeria + Instagram ON |
| 30/jun      | Encerramento + relatório                             |
