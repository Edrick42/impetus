# Roadmap — Site Instituto Impetus

> Estado atual: estrutura técnica completa, aguardando inputs do cliente (marca, conteúdo, infra) para finalização e go-live.

Última atualização: 2026-05-25

---

## Visão geral por fase

| Fase | Status         | Prazo de referência | Bloqueia |
| ---- | -------------- | ------------------- | -------- |
| 0 · Estrutura técnica         | ✅ Concluída  | —              | — |
| 1 · Identidade visual         | ⏳ Aguardando | até 10/jun     | Go-live |
| 2 · Conteúdo institucional    | ⏳ Aguardando | até 10/jun     | Go-live |
| 3 · Infra externa             | ⏳ Aguardando | até 22/jun     | Galeria/Instagram |
| 4 · Deploy e domínio          | ⏳ Aguardando | até 10/jun     | Go-live |
| 5 · QA, acessibilidade, perf  | 🟡 Parcial    | até 10/jun     | Go-live |
| 6 · Pós-evento e operação     | 🔵 Futuro     | a partir de 28/jun | — |

Legenda: ✅ feito · 🟡 parcial · ⏳ aguardando input externo · 🔵 futuro · 🚧 em execução

---

## Fase 0 — Estrutura técnica ✅

Tudo concluído nesta entrega.

- [x] Bootstrap Next.js 15 + TypeScript + Tailwind + pnpm
- [x] Design tokens em CSS vars (cores 60-30-10, tipografia, escala, radius, shadows)
- [x] i18n com next-intl — PT (default), EN, ES + LanguageSwitcher + hreflang
- [x] Layout: Header sticky, Footer, skip link, focus styles, reduced-motion
- [x] Home com 8 seções: Hero, About, Projects, Events, GalleryPreview, InstagramFeed, BlogPreview, Contact
- [x] Blog: loader MDX, lista, página de post, ReadingProgress
- [x] 9 posts de exemplo (3 em cada idioma) — placeholders marcados
- [x] Galeria: AlbumGrid, PhotoGrid, Lightbox custom (teclado, download, Web Share)
- [x] Cliente Piwigo com fallback mock (Pexels) — funciona sem credenciais
- [x] Cliente Instagram Graph API com fallback de placeholder
- [x] Microsoft Clarity instalado (prod-only) + 4 eventos customizados
- [x] SEO: metadata por rota, JSON-LD (6 tipos schema.org), sitemap dinâmico, robots, hreflang, OG image dinâmica
- [x] Build limpo: 30 páginas geradas, `tsc --noEmit` passa

---

## Fase 1 — Identidade visual ⏳

**O que falta:** entrega da identidade pela Andréa Faria Marketing (na proposta, prevista para 29/mai com direções e 10/jun com aprovação final).

**O que precisamos receber:**

- [ ] **Paleta de cores oficial** — HEX para: fundo, texto, surface, muted, brand (cor de ação), brand-fg (texto sobre brand), border
- [ ] **Tipografia oficial** — família display (títulos) + família body (corpo). Idealmente Google Fonts; se for fonte paga/customizada, fornecer os arquivos `.woff2`
- [ ] **Logo** — versões horizontal, vertical, símbolo isolado em `.svg` + `.png` (proposta menciona estas 3 variações)
- [ ] **Favicon** — `.ico` 32×32 + idealmente um `.png` 512×512 para PWA
- [ ] **OG default image** — 1200×630px para fallback quando não houver imagem específica (`public/og-default.png`)

**Onde encaixar (uma vez que chegar):**

- Cores e tipografia: editar apenas `app/globals.css` (variáveis em `:root`) e `app/[locale]/layout.tsx` (imports `next/font`)
- Logo: substituir referência em `components/layout/Header.tsx` (hoje é só texto) por componente com SVG inline
- Arquivos estáticos: `public/logo.png`, `public/favicon.ico`, `public/og-default.png`

**Estimativa de trabalho:** ~2-3 horas para integrar tudo após receber.

---

## Fase 2 — Conteúdo institucional ⏳

**O que falta:** textos oficiais do Instituto Impetus (hoje há placeholders baseados em informação pública).

**O que precisamos receber do cliente:**

- [ ] **Sobre o Instituto** — história real (parágrafo de origem), missão oficial, visão oficial, lista de valores
- [ ] **Projetos e iniciativas** — quais existem além de patrocinar Favela + Rica? Educação, mentorias, programas de fomento? Cada um com título, descrição curta (1-2 parágrafos) e idealmente uma foto
- [ ] **Evento Favela + Rica** — descrição oficial em parceria com o evento (datas confirmadas: 26-27/jun/2026), local exato (proposta diz "Rio de Janeiro" sem endereço), público esperado, links de inscrição
- [ ] **Equipe / liderança** — opcional mas recomendado: 3-5 pessoas com foto, nome e cargo (cria credibilidade)
- [ ] **Estatísticas/números** — se existirem ("X empreendedores apoiados", "Y projetos ativos") — fortalecem muito a página
- [ ] **Contato** — e-mail oficial, telefone (opcional), endereço físico (se houver)
- [ ] **Redes sociais** — handle oficial do Instagram (hoje aponto para `@institutoimpetus`, confirmar) e outras redes
- [ ] **Posts iniciais do blog** — pelo menos 3 posts reais para substituir os placeholders no go-live

**Idiomas:** todo conteúdo precisa vir em PT obrigatoriamente. EN e ES podem ser traduzidos por IA com revisão posterior.

**Onde encaixar:**

- Strings de UI e blocos curtos: `messages/{pt,en,es}.json`
- Posts do blog: substituir arquivos em `content/posts/{pt,en,es}/*.mdx`
- Blocos longos da home (Sobre, Projetos): podemos migrar para MDX em `content/pages/` se ficar grande

**Estimativa de trabalho:** ~3-4 horas para inserir todo o conteúdo final.

---

## Fase 3 — Infra externa ⏳

### 3.1 Piwigo (galeria de fotos) — prazo 22/jun

Responsabilidade do Instituto, conforme proposta.

- [ ] **Provisionar VPS** (sugestões: DigitalOcean droplet R$ 30/mês, Hostinger VPS, ou Locaweb)
- [ ] **Instalar Piwigo** (instalação típica: ~15 min com Docker; ~30 min manual via cPanel)
- [ ] **Configurar domínio/subdomínio** (sugestão: `fotos.institutoimpetus.org` ou `galeria.institutoimpetus.org`)
- [ ] **Criar usuário de API** com permissão de leitura
- [ ] **Habilitar CORS** para o domínio do site
- [ ] **HTTPS via Let's Encrypt** (obrigatório — site é HTTPS)
- [ ] **Treinar fotógrafo do evento** para subir álbuns/fotos

**O que nos passar quando estiver pronto:**

```
PIWIGO_API_URL=https://fotos.institutoimpetus.org
PIWIGO_USERNAME=api_reader
PIWIGO_PASSWORD=<senha>
```

**Se preferir alternativa:** Cloudinary (free tier generoso, CDN global, zero infra para manter) — exige refactor de ~3h no `lib/piwigo.ts`.

### 3.2 Instagram Graph API — opcional, prazo flexível

- [ ] **Converter conta para Instagram Business** (gratuito, leva 2 min nas configs)
- [ ] **Criar app no Meta for Developers** (developers.facebook.com)
- [ ] **Gerar Access Token de longa duração**
- [ ] **Obter Instagram User ID** (via Graph API Explorer)

**O que nos passar:**

```
IG_ACCESS_TOKEN=<token>
IG_USER_ID=<id>
```

Enquanto não estiver pronto: a seção mostra o placeholder "Em breve novidades por aqui" + link direto para o perfil. Sem bloqueio.

### 3.3 Microsoft Clarity — opcional, recomendado antes do evento

- [ ] **Criar conta** em clarity.microsoft.com (gratuito, sem limite)
- [ ] **Criar projeto** "Instituto Impetus" e copiar o Project ID
- [ ] **Configurar política de privacidade** (LGPD: mencionar Clarity como ferramenta de analytics)

**O que nos passar:**

```
NEXT_PUBLIC_CLARITY_PROJECT_ID=<id>
```

Carrega só em produção. Sem ele, o site funciona normalmente mas sem heatmaps.

### 3.4 E-mail de contato

- [ ] **Confirmar e-mail oficial** (hoje placeholder: `contato@institutoimpetus.org`)
- [ ] Setar em `NEXT_PUBLIC_CONTACT_EMAIL`

---

## Fase 4 — Deploy e domínio ⏳

- [ ] **Registrar/confirmar domínio** (hoje assumo `institutoimpetus.org` — confirmar com cliente). Alternativas: `.org.br`, `.com.br`, `.org`
- [ ] **Criar repositório no GitHub** e fazer push do projeto
- [ ] **Criar conta Vercel** (free tier suficiente até centenas de milhares de visitas)
- [ ] **Conectar repo ao Vercel** (deploy automático em push para `main`)
- [ ] **Configurar domínio custom no Vercel** + apontar DNS (Vercel emite HTTPS automático via Let's Encrypt)
- [ ] **Setar env vars de produção no Vercel** — todas as do `.env.local.example` que estiverem disponíveis
- [ ] **Submeter sitemap no Google Search Console** e Bing Webmaster Tools
- [ ] **Configurar redirecionamento www → root** (ou vice-versa, decisão do cliente)

**Estimativa:** ~2h depois que domínio estiver registrado.

---

## Fase 5 — QA, acessibilidade, performance 🟡

Validar pré go-live com o site já populado de conteúdo real.

### Performance
- [ ] **Lighthouse mobile** ≥ 90 em Performance, ≥ 95 em SEO/Accessibility/Best Practices
- [ ] **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] **Otimizar imagens** uploaded pelo cliente (WebP, < 300KB cada, dimensão correta)
- [ ] **Auditar bundle size** com `pnpm build` — confirmar que First Load JS está ≤ 130 KB nas páginas

### Acessibilidade
- [ ] **axe DevTools** sem violações em todas as páginas
- [ ] **Navegação completa por teclado** — Tab, Enter, Esc, setas no lightbox
- [ ] **Leitor de tela** (VoiceOver no Mac) — testar home e galeria
- [ ] **Contraste AA** validado com as cores oficiais (depende da marca chegar)
- [ ] **Skip link** funcional

### SEO
- [ ] **Rich Results Test** (search.google.com/test/rich-results) sem erros nos 6 tipos schema.org
- [ ] **Validador Schema.org** (validator.schema.org) sem erros
- [ ] **Sitemap** acessível e válido
- [ ] **hreflang** validado com Screaming Frog (free até 500 URLs)
- [ ] **Meta description** preenchida em todas as páginas

### Cross-browser / device
- [ ] **iPhone real** (Safari) — guia menciona que DevTools engana
- [ ] **Android real** (Chrome)
- [ ] **Desktop** Chrome, Firefox, Safari
- [ ] **Modo escuro do SO** — site é claro; confirmar que não há contraste quebrado

### Funcional
- [ ] **Trocar idioma** preserva pathname e função
- [ ] **Lightbox** abre, navega ←/→/Esc, baixa foto, compartilha
- [ ] **Blog** lista, página individual, ReadingProgress dispara evento
- [ ] **Formulário de contato** (hoje é só mailto: — confirmar com cliente se quer formulário real com backend)
- [ ] **404** localizado nos 3 idiomas

---

## Fase 6 — Pós-evento e operação 🔵

A partir de 28/jun/2026.

- [ ] **Backup das fotos do evento** (cliente, no Piwigo)
- [ ] **Galeria continua acessível** — sem TTL, fica permanente
- [ ] **Plano de conteúdo do blog** — definir cadência (semanal? mensal?) e quem escreve
- [ ] **Monitorar Clarity** — primeira análise de heatmaps após o evento (identificar dead clicks, rage clicks, scroll depth)
- [ ] **Acompanhar Search Console** — primeira indexação leva 1-2 semanas, depois rankear é um processo de meses
- [ ] **Renovar Instagram Access Token** — tokens de longa duração expiram em 60 dias; programar lembrete
- [ ] **Considerar formulário real** se mailto não converter bem (sugestão: Resend + API route, ~3h de trabalho)
- [ ] **Newsletter** — se o cliente quiser engajar a base após o evento (Resend ou Mailchimp, ~4h)

---

## Riscos e dependências críticas

| Risco                                                    | Impacto      | Mitigação |
| -------------------------------------------------------- | ------------ | --------- |
| Identidade visual atrasa além de 10/jun                  | Site fica com tokens placeholder no ar | Lançar com tokens neutros e fazer swap depois — não bloqueia go-live técnico |
| Piwigo não fica pronto até 22/jun                        | Galeria fica com mock no dia do evento | Migrar para Cloudinary (~3h refactor) ou aceitar fotos pós-evento |
| Conteúdo oficial não chega a tempo                       | Site vai ao ar com placeholders | Avisar cliente — placeholders estão marcados, mas não devem ir para produção |
| Cliente não tem domínio registrado                       | Não dá para deploy em URL oficial      | Usar URL temporária Vercel (`*.vercel.app`) — funciona mas perde branding |
| Instagram Graph API leva semanas para aprovar app Meta   | Feed não vai ao ar                     | Já está com fallback — não bloqueia |

---

## O que precisamos do cliente — checklist único

Lista consolidada do que falta receber para finalizar:

### Bloqueia go-live (10/jun)
- [ ] Cores oficiais (paleta completa)
- [ ] Tipografia oficial (família display + body)
- [ ] Logo (3 variações em SVG)
- [ ] Favicon
- [ ] OG default image (1200×630)
- [ ] Texto Sobre o Instituto (história, missão, visão, valores)
- [ ] Lista de projetos/iniciativas (mín. 3, com descrição)
- [ ] Descrição oficial do Favela + Rica
- [ ] E-mail oficial de contato
- [ ] Handle confirmado do Instagram
- [ ] Domínio registrado + apontar DNS para Vercel
- [ ] 3 posts iniciais do blog (em PT)

### Bloqueia galeria (22/jun)
- [ ] Piwigo provisionado (URL, usuário, senha)

### Recomendado mas não bloqueante
- [ ] Conta Instagram Business + Graph API (feed na home)
- [ ] Microsoft Clarity Project ID (heatmaps)
- [ ] Fotos profissionais para hero e projetos (caso contrário, stock do Pexels segue)
- [ ] Equipe/liderança (3-5 pessoas)
- [ ] Estatísticas reais de impacto

---

## Como rodar o que já existe

```bash
pnpm install
cp .env.local.example .env.local   # opcional — site funciona sem env vars
pnpm dev                            # localhost:3000
```

Tudo está documentado no `README.md`.
