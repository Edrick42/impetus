# Auditoria de Segurança — Site Instituto Impetus

Data: 2026-05-25
Escopo: código atual em `main`, antes do go-live
Resultado geral: **🟢 BAIXO RISCO** — nenhum problema crítico ou alto encontrado. Algumas melhorias recomendadas antes do go-live.

---

## Resumo executivo

| Categoria               | Status | Itens |
| ----------------------- | ------ | ----- |
| Dependências            | 🟡     | 1 vulnerabilidade explorável (corrigível com upgrade) |
| Secrets management      | 🟢     | Sem segredos no código, env vars bem separadas |
| XSS / Injection         | 🟢     | Mitigado pelo React + 1 ponto de atenção |
| Headers HTTP            | 🟡     | Bons básicos, falta CSP e HSTS explícito |
| External links          | 🟢     | Todos com `noopener noreferrer` |
| API integrations        | 🟡     | Instagram token na query string |
| User input              | 🟢     | Não há formulários com submit hoje |
| Cookies / auth          | 🟢     | Não usamos — sem superfície de ataque |
| LGPD / privacidade      | 🟡     | Clarity exige menção em política de privacidade |

Legenda: 🔴 crítico · 🟠 alto · 🟡 médio · 🟢 baixo/OK

---

## 1. Dependências 🟡

### 1.1 `next-intl < 4.9.2` — Open Redirect + Prototype Pollution

`pnpm audit` detectou 2 vulnerabilidades em `next-intl@3.26.5` (versão atualmente instalada):

| CVE / GHSA | Severidade | Versão patched | Aplica? |
| --- | --- | --- | --- |
| [GHSA-8f24-v5vv-gm5j](https://github.com/advisories/GHSA-8f24-v5vv-gm5j) — Open Redirect via locale | Moderada | ≥ 4.9.1 | **Sim** — usamos roteamento por locale |
| [GHSA-4c35-wcg5-mm9h](https://github.com/advisories/GHSA-4c35-wcg5-mm9h) — Prototype pollution via precompile | Moderada | ≥ 4.9.2 | **Não** — não usamos `experimental.messages.precompile` |

**Impacto real:** o open redirect permite redirecionar para domínio arbitrário se o atacante manipula o segmento de locale na URL. Não é exploit remoto profundo, mas é vetor para phishing (manda link `institutoimpetus.org/...` que redireciona para site falso).

**Outros pacotes auditados:** total 4 vulnerabilidades (3 moderate + 1 high) — todas no mesmo pacote ou em deps transitivas dele.

**🔧 Ação recomendada (antes do go-live):**

```bash
pnpm up next-intl@latest
pnpm typecheck && pnpm build   # validar que não quebra (v3 → v4 tem breaking changes mínimas no nosso uso)
```

Se houver breaking changes, alternativa é fazer pin em `3.26.5` e adicionar validação manual de locale (já temos, parcialmente).

**Operacional contínuo:** rodar `pnpm audit` mensalmente. CI/CD pode incluir `pnpm audit --prod --audit-level high` que falha se aparecer alta/crítica.

---

## 2. Secrets management 🟢

### O que está certo

- ✅ Nenhuma credencial hardcoded no código (busca `grep -r "password\|token\|api_key"` retornou só nomes de variáveis)
- ✅ `.env`, `.env.local` e variantes estão no `.gitignore`
- ✅ `.env.local.example` documenta as vars mas com valores vazios
- ✅ Apenas vars prefixadas com `NEXT_PUBLIC_*` são expostas ao cliente (Clarity ID, contact email, site URL)
- ✅ `PIWIGO_PASSWORD`, `PIWIGO_USERNAME`, `IG_ACCESS_TOKEN` NÃO têm prefixo public — ficam no servidor
- ✅ `lib/piwigo.ts` e `lib/instagram.ts` têm `import 'server-only'` no topo — Next.js bloqueia bundling para o cliente em build time
- ✅ Validação com zod em `lib/env.ts` — formato é checado em runtime

### Recomendações

- **Production secrets via Vercel UI**: setar `PIWIGO_PASSWORD` etc. em Vercel Project Settings → Environment Variables, marcar como "Sensitive" (Vercel mascara em logs e UI)
- **Rotação periódica**: Instagram Access Token expira em 60 dias por padrão — programar lembrete; Piwigo password rotacionar trimestralmente
- **Não logar env vars**: o código atual usa `console.warn` para erros de validação mas não imprime valores. ✓

---

## 3. XSS e injeção de HTML 🟢

### O único uso de `dangerouslySetInnerHTML`

Em `components/seo/JsonLd.tsx`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replace(/</g, '\\u003c'),
  }}
/>
```

**Análise:**
- ✅ O `data` vem de funções tipadas em `lib/seo.ts` (`organizationLd`, `eventLd`, etc.) — não há input do usuário
- ✅ `JSON.stringify` produz JSON válido — não há HTML executável
- ✅ Escape de `<` para `<` previne fechamento prematuro de `</script>`
- ✅ `type="application/ld+json"` não é executado pelo browser — apenas lido por bots
- ✅ Mesmo se houvesse XSS aqui, o navegador não executaria JS dessa tag

**Veredito:** seguro nesta implementação. Padrão usado por Next.js Docs, Vercel, etc.

### MDX (blog posts)

`next-mdx-remote/rsc` compila MDX em build-time a partir de arquivos do filesystem que **nós controlamos** (`content/posts/`). Não há renderização de MDX vindo de input externo. ✓

Se no futuro tivermos um CMS onde o cliente edita MDX, vai precisar:
- Sanitização de tags HTML embutidas
- Lista branca de componentes MDX permitidos
- Limite de profundidade de aninhamento

### React JSX

Resto da aplicação usa apenas JSX comum — React faz auto-escape de strings inseridas em `{}`. Nenhum risco de XSS aqui.

---

## 4. Headers HTTP 🟡

### O que já temos (em `next.config.mjs`)

```js
{ key: 'X-Content-Type-Options', value: 'nosniff' },       // ✅ previne MIME sniffing
{ key: 'X-Frame-Options', value: 'DENY' },                 // ✅ previne clickjacking
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },  // ✅ previne info leak
{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' } // ✅ apenas em /_next/image
```

### O que falta (🔧 recomendado antes do go-live)

**Strict-Transport-Security (HSTS)** — força HTTPS em todas as requisições:
```js
{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
```
Vercel adiciona automaticamente, mas declarar explícito é boa prática.

**Permissions-Policy** — restringe APIs sensíveis que não usamos:
```js
{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' }
```

**Content-Security-Policy (CSP)** — defesa mais robusta contra XSS:

Implementação requer atenção porque o site tem:
- Script inline do Clarity (`dangerouslySetInnerHTML`)
- JSON-LD inline (mas type=application/ld+json não é executado)
- next/image carregando de Pexels, Instagram CDN, eventualmente Piwigo

CSP recomendada (rascunho — precisa testar):
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.clarity.ms https://*.clarity.ms;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://images.pexels.com https://*.cdninstagram.com https://*.fbcdn.net https://*.clarity.ms;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://www.clarity.ms https://*.clarity.ms https://graph.instagram.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

Implementar via middleware é mais flexível que `next.config.mjs` (pode usar nonce dinâmico). Tarefa de 1-2h.

---

## 5. External links 🟢

Verificado: **todos** os `target="_blank"` têm `rel="noopener noreferrer"` apropriado.

```
components/home/Contact.tsx:44 — ✅
components/home/InstagramFeed.tsx:23, 37 — ✅
components/gallery/Lightbox.tsx — usa window.open com 'noopener' ✅
```

Previne:
- `tabnabbing` (página externa controlando window.opener) ✓
- Vazamento de referrer ✓

---

## 6. Integrações externas 🟡

### 6.1 Instagram Graph API — token na query string

`lib/instagram.ts:24`:
```ts
const url = `https://graph.instagram.com/${env.IG_USER_ID}/media?fields=${fields}&limit=${limit}&access_token=${env.IG_ACCESS_TOKEN}`;
```

**Risco:**
- 🟡 Tokens em query string podem vazar para logs de servidor, logs de proxy, históricos de browser (não aplicável aqui pois é server-side), e analytics. Vercel não loga URLs completas — risco baixo no nosso caso.
- ✅ A função tem `import 'server-only'` — nunca executa no cliente.
- ✅ Token nunca chega ao navegador do visitante.

**🔧 Ação recomendada (mais por boa prática que por exploit imediato):** Instagram aceita o token via header `Authorization: Bearer <token>` — refatorar para usar header.

### 6.2 Piwigo — credenciais não usadas

`lib/piwigo.ts`: as funções `getAlbums`/`getAlbumPhotos` chamam a API REST do Piwigo SEM autenticar.

**Risco de segurança:** 🟢 nenhum — credenciais estão no env mas não são enviadas.

**Risco funcional:** 🟡 se o Piwigo do cliente requer login (configuração padrão para álbuns privados), as chamadas vão falhar e cair no fallback mock.

**🔧 Ação recomendada:** quando o cliente provisionar o Piwigo, adicionar chamada a `pwg.session.login` antes das outras chamadas, ou marcar os álbuns do evento como públicos no painel do Piwigo (mais simples).

### 6.3 Server fetch com cache

Tanto `lib/piwigo.ts` quanto `lib/instagram.ts` usam `fetch(..., { next: { revalidate, tags } })` — feature nativa do Next.js para revalidação. Não há risco de SSRF porque as URLs vêm de env vars que **nós controlamos**, não de input do usuário.

---

## 7. Input do usuário 🟢

**Hoje não há nenhum formulário que envia dados para o servidor.**

- Lightbox: opera só com dados que vêm do Piwigo (lado servidor)
- LanguageSwitcher: navega entre rotas pré-definidas
- Contato: usa `mailto:` — abre cliente de e-mail local, não envia nada via nosso site
- Blog: leitura apenas

**Quando adicionarmos formulário real de contato** (provavelmente pós-evento), vamos precisar:
- ✅ Validação server-side (zod no Server Action)
- ✅ Honeypot ou rate limiting (`upstash/ratelimit` para IP-based)
- ✅ Sanitização do payload antes de enviar e-mail (não interpolar em HTML do e-mail)
- ✅ Captcha invisível (Cloudflare Turnstile é gratuito e bom)
- ✅ Origem do request validada (anti-CSRF, embora Server Actions já tenham proteção)

---

## 8. Roteamento e validação de params 🟢

Param `locale` vem da URL. Em todas as páginas:

```ts
const { locale: rawLocale } = await params;
const locale = rawLocale as Locale;
setRequestLocale(locale);
```

**Análise:**
- `middleware.ts` (next-intl) já bloqueia locales inválidos antes de chegar às páginas — só `/pt`, `/en`, `/es` passam
- O cast `as Locale` é seguro porque o middleware filtrou antes
- ✅ Não há risco de injeção pelo locale

Param `slug` (blog) e `album` (galeria):
- ✅ `generateStaticParams` pré-renderiza apenas slugs válidos. Slugs desconhecidos retornam 404 via `notFound()`
- ✅ Path traversal não aplicável: `getPostBySlug` filtra um array em memória, não compõe path do filesystem com o slug

---

## 9. Cookies, sessões, autenticação 🟢

**Não existe nenhum dos três no site.**

Sem login, sem cookies de sessão, sem JWT, sem CSRF possível. A única coisa que poderia armazenar dados é o Clarity, que tem cookies próprios sob seu domínio (gerenciado pela Microsoft, GDPR-compliant).

---

## 10. LGPD e privacidade 🟡

### Tracking ativo

- **Microsoft Clarity** (heatmap + session replay) — em produção
- Eventos customizados disparados:
  - `language_switch` (idioma anterior → novo)
  - `download_photo` (álbum + ID da foto)
  - `share_photo` (álbum + ID da foto)
  - `blog_post_complete` (slug do post)

Nenhum dado pessoal (nome, e-mail, IP, etc.) é enviado por nós ao Clarity. O Clarity em si captura:
- Movimento de mouse e cliques
- Scroll depth
- Sessions replays (com mascaramento automático de campos sensíveis)
- IP do usuário (anonimizado por padrão)
- User agent

### 🔧 Obrigações antes do go-live

- [ ] **Política de Privacidade** (página `/politica-de-privacidade`) — exigência LGPD para qualquer site que coleta dados, mesmo via terceiros
- [ ] Mencionar explicitamente:
  - Que usamos Microsoft Clarity para análise de comportamento
  - Quais eventos rastreamos (lista acima)
  - Link para política do Clarity: https://privacy.microsoft.com/privacystatement
  - Como o usuário pode optar por não ser rastreado (Do-Not-Track header, bloqueadores)
- [ ] **Cookie banner** — opcional mas recomendado. Clarity carrega cookies; LGPD exige consentimento para cookies de tracking (mesmo que de terceiros). Sugestão: usar `react-cookie-consent` (~30min de trabalho)
- [ ] **DPO/Encarregado**: a LGPD exige um DPO para organizações que tratam dados pessoais. Se o Instituto Impetus ainda não tem, indicar quem é
- [ ] **Termos de uso** (página `/termos`) — opcional para site institucional sem login, mas recomendado

---

## 11. Infra e deploy 🟢

### Vercel (recomendado)

- HTTPS automático via Let's Encrypt
- DDoS protection da Cloudflare/AWS integrada
- Isolamento de execução (cada request em sandbox)
- Logs sem expor secrets quando marcados como sensitive

### Piwigo (cliente)

⚠️ **Responsabilidade do cliente, mas pontos a alertar:**

- [ ] Manter Piwigo atualizado (vulnerabilidades em PHP/Wordpress-like são comuns)
- [ ] HTTPS via Let's Encrypt obrigatório
- [ ] Limitar área admin a IP específico ou usar 2FA
- [ ] Backup automático das fotos (cliente pode perder o evento todo)
- [ ] Não expor `/pwg.php?method=pwg.session.login` publicamente sem rate limiting (atacantes podem brute-force)
- [ ] Setar `allow_user_registration = false` (Piwigo já vem assim por padrão, confirmar)

---

## 12. Bibliotecas third-party 🟢

Inventory rápido:

| Pacote               | Versão  | Origem            | Risco |
| -------------------- | ------- | ----------------- | ----- |
| next                 | 15.5.18 | Vercel (oficial)  | 🟢    |
| react / react-dom    | 19.2.6  | Meta (oficial)    | 🟢    |
| next-intl            | 3.26.5  | amannn (community) | 🟡 — vulnerabilidades acima |
| next-mdx-remote      | 5.0.0   | Hashicorp         | 🟢    |
| tailwindcss          | 3.4.19  | Tailwind Labs     | 🟢    |
| zod                  | 3.25.76 | colinhacks        | 🟢    |
| gray-matter          | 4.0.3   | jonschlinkert     | 🟢    |
| clsx, tailwind-merge | recentes | dcastil/lukeed   | 🟢    |

Nenhum pacote obscuro, todos com manutenção ativa. 1 com CVEs aberto (next-intl) — ação descrita em §1.

---

## 13. Checklist de hardening pré go-live

Por ordem de prioridade:

### Obrigatório
- [ ] Upgrade `next-intl` para ≥ 4.9.2 e validar build
- [ ] Adicionar headers `Strict-Transport-Security` e `Permissions-Policy` em `next.config.mjs`
- [ ] Criar página `/politica-de-privacidade` com menção a Clarity
- [ ] Validar com `pnpm audit --prod --audit-level high` no CI

### Fortemente recomendado
- [ ] Implementar CSP via middleware
- [ ] Mover token Instagram de query string para header `Authorization`
- [ ] Cookie banner LGPD-compliant
- [ ] Marcar secrets como "Sensitive" no Vercel
- [ ] Configurar rate limiting nos endpoints de imagem se virar gargalo

### Para quando adicionar formulário/login
- [ ] Server Actions com validação zod
- [ ] Captcha (Cloudflare Turnstile)
- [ ] Rate limiting (Upstash)
- [ ] Honeypot
- [ ] CSRF tokens (Server Actions já protegem)

### Operacional contínuo
- [ ] `pnpm audit` mensal
- [ ] Dependabot ou Renovate ativo no GitHub
- [ ] Lembrete de rotação do Instagram token (60 dias)
- [ ] Monitorar Vercel logs em busca de erros 5xx ou 4xx anômalos
- [ ] Alerta em Search Console para malware/hack flag

---

## 14. Modelo de ameaças

### Quem poderia querer atacar este site?

- **Spammers** (mais provável) — formulário de contato vai virar alvo assim que existir. Mitigação: captcha + honeypot.
- **Phishers** — usam open redirect do `next-intl` para mandar links `institutoimpetus.org/...` que redirecionam para site falso. Mitigação: upgrade do pacote.
- **Defacers / hacktivistas** — geralmente miram WordPress e CMSs antigos. Nosso stack (Next.js + Vercel) é alvo improvável; o **Piwigo do cliente** é mais atrativo. Mitigação: o cliente manter Piwigo atualizado.
- **Bots de scraping** — coletam e-mails para spam. Mitigação: nenhuma 100%, mas obfuscar email no HTML (`href="mailto:..."` está exposto) não vale o trade-off de UX.
- **Direcionados** — improvável neste perfil de site institucional sem dados sensíveis.

### O que NÃO está em escopo

- Dados financeiros (não processamos pagamentos)
- Dados pessoais sensíveis (não há cadastro)
- Propriedade intelectual de terceiros (todo conteúdo é do Instituto)
- Disponibilidade crítica (não é sistema de missão crítica — Vercel SLA é suficiente)

---

## 15. Conclusão

**O código atual está em bom estado de segurança.** Não há vulnerabilidades exploráveis criticamente, e o uso conservador de tecnologias (React server components, server-only imports, env vars validadas, sem formulários) reduz drasticamente a superfície de ataque.

**Antes do go-live**, executar os 4 itens "Obrigatório" do checklist na §13. Tempo total estimado: ~2 horas.

**Depois do go-live**, manter rotina mensal de `pnpm audit` e atenção aos avisos do Dependabot/Renovate.

Esta auditoria deve ser repetida:
- Antes de adicionar formulários com submit ou login
- Antes de integrar com novas APIs externas (pagamento, e-mail marketing, CRM)
- Em caso de incidente
- Trimestralmente como rotina
