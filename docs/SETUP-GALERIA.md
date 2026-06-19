# Setup operacional da Galeria

Passo a passo para ligar Supabase + Cloudflare R2 e colocar a galeria com
upload de fotógrafos em produção.

**Tempo estimado:** 60-90 min de cliques (sem programação).

---

## Pré-requisitos

- Conta no **Supabase** (https://supabase.com — login Google ou GitHub funciona)
- Conta na **Cloudflare** (https://dash.cloudflare.com — Google/GitHub)
- Acesso ao projeto **Vercel** onde o site está (ou estará) hospedado
- Email do **primeiro admin** (provavelmente o seu)

---

## Etapa 1 — Supabase (auth + banco)

### 1.1 Criar projeto

1. Entrar em https://supabase.com/dashboard
2. Clicar **New project**
3. Preencher:
   - **Name:** `impetus-galeria`
   - **Database password:** clicar "Generate" e **salvar no 1Password/cofre**
   - **Region:** `South America (São Paulo)` — `sa-east-1`
   - **Pricing plan:** Free
4. Clicar **Create new project**. Aguardar ~2 min até ficar verde.

### 1.2 Rodar a migration

1. Menu lateral → **SQL Editor** → **New query**
2. Abrir o arquivo `supabase/migrations/0001_gallery.sql` deste repo
3. Copiar tudo, colar no editor do Supabase
4. Clicar **Run** (canto inferior direito)
5. Deve aparecer "Success. No rows returned."

> Se aparecer erro, copiar e me mandar — provavelmente é uma extensão a habilitar.

### 1.3 Coletar as 3 credenciais

Menu lateral → **Project Settings** → **API**

Copiar e guardar:

| Campo (Supabase) | Vai virar (env var) |
|---|---|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** (API keys) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role secret** (API keys) | `SUPABASE_SERVICE_ROLE_KEY` |

⚠️ A **service_role** é **secreta** — nunca commitar, nunca colar no client.
Só vai em env vars do server (Vercel ou `.env.local`).

### 1.4 Criar o primeiro admin

Menu lateral → **Authentication** → **Users** → **Add user** → **Create new user**

- **Email:** o seu e-mail (ou o do contato do Instituto)
- **Password:** crie uma forte e salve
- ✅ **Auto Confirm User** (marcado)
- Clicar **Create user**

Depois, na lista, clicar nesse usuário recém-criado:

- Rolar até **Raw user meta data** (Raw App Meta Data)
- No campo **Raw App Meta Data**, colar:
  ```json
  { "role": "admin" }
  ```
- **Save**

Pronto — esse usuário entra como admin assim que logar em `/entrar`.

---

## Etapa 2 — Cloudflare R2 (storage de imagens)

### 2.1 Ativar R2 na conta

1. Entrar em https://dash.cloudflare.com
2. Menu lateral → **R2 Object Storage**
3. Se for a primeira vez, clicar **Purchase R2 Plan** — **NÃO se assuste**, o
   plano free não cobra cartão até estourar 10GB. Ele só pede método de
   pagamento para o caso de uso pago.

### 2.2 Criar o bucket

1. **Create bucket**
2. Nome: `impetus-gallery` (exato)
3. **Location:** Automatic
4. **Storage class:** Standard
5. **Create**

### 2.3 Expor o bucket via subdomínio público

Há dois caminhos. **Use o A (rápido) para o MVP** e migre pro B depois.

**Opção A — Subdomínio `r2.dev` (instantâneo)**

1. No bucket → aba **Settings**
2. Em **Public access** → **R2.dev subdomain** → **Allow Access**
3. Vai aparecer uma URL tipo `https://pub-abc123.r2.dev`
4. Copiar essa URL — será o `R2_PUBLIC_URL`

⚠️ `r2.dev` tem rate limit baixo e Cloudflare pode descontinuar. Para evento
público real, migrar para opção B.

**Opção B — Custom domain (recomendado para produção)**

1. Precisa ter o domínio do Instituto na Cloudflare DNS
2. No bucket → **Settings** → **Custom Domains** → **Connect Domain**
3. Subdomínio sugerido: `fotos.institutoimpetus.com.br`
4. Cloudflare cria o registro DNS sozinho, propaga em ~5 min
5. URL final: `https://fotos.institutoimpetus.com.br` → será o `R2_PUBLIC_URL`

### 2.4 Gerar API token de leitura/escrita

1. Voltar para **R2 Object Storage** (lista de buckets)
2. Direita superior → **Manage R2 API Tokens** → **Create API token**
3. Preencher:
   - **Token name:** `impetus-gallery-rw`
   - **Permissions:** **Object Read & Write**
   - **Specify bucket(s):** `impetus-gallery`
   - **TTL:** Forever (ou 1 ano com lembrete de renovar)
4. **Create API Token**

Vai aparecer **uma vez só** (não fecha sem copiar):

| Campo (Cloudflare) | Vai virar (env var) |
|---|---|
| **Access Key ID** | `R2_ACCESS_KEY_ID` |
| **Secret Access Key** | `R2_SECRET_ACCESS_KEY` |
| Account ID (mostrado no canto direito do dash R2) | `R2_ACCOUNT_ID` |

### 2.5 Hotlink protection (opcional, recomendado)

Cloudflare dashboard → **Scrape Shield** → **Hotlink Protection** → On.
Evita que outros sites embedem suas fotos consumindo sua banda (a R2 não cobra
egress, mas é higiene).

---

## Etapa 3 — Local (.env.local) para testar antes de subir

1. Copiar `.env.local.example` para `.env.local` (se ainda não tiver feito):
   ```bash
   cp .env.local.example .env.local
   ```

2. Preencher com os valores coletados:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

   R2_ACCOUNT_ID=abc123...
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_BUCKET=impetus-gallery
   R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
   ```

3. Reiniciar o dev server (`Ctrl+C` e `pnpm dev` de novo).

4. Acessar `http://localhost:3000/pt/entrar` → logar com o admin que você
   criou no Supabase.

5. Você deve ser redirecionado para `/pt/admin`. Criar um evento de teste,
   subir 2-3 fotos, marcar como publicado, ver aparecer em `/pt/galeria`.

---

## Etapa 4 — Produção (Vercel)

1. Vercel Dashboard → projeto Impetus → **Settings** → **Environment Variables**
2. Adicionar **todas** as 8 vars novas (todas como **Production** e **Preview**):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET
R2_PUBLIC_URL
```

3. **Deployments** → último deployment → **⋯** → **Redeploy** (sem cache).

4. Repetir o teste da Etapa 3.4 contra a URL de produção.

---

## Etapa 5 — Criar fotógrafos e atribuir ao Favela + Rica

Tudo pela UI agora.

1. Logar em `/pt/entrar` como admin
2. `/pt/admin/eventos` → preencher:
   - **Nome:** Favela + Rica 2026
   - **Slug:** `favela-rica-2026`
   - **Data:** `2026-06-26`
   - **Descrição:** (livre)
3. Deixar como **rascunho** por enquanto (botão azul aparece como "Publicar")
4. `/pt/admin/fotografos` → para cada fotógrafo:
   - E-mail dele
   - Senha temporária (gerar forte, ex. `Impetus#2026-Foto1`)
   - Marcar o evento Favela + Rica 2026
   - **Criar fotógrafo**
5. Enviar para cada fotógrafo (por canal seguro — WhatsApp, e-mail criptografado):
   - Link: `https://institutoimpetus.com.br/pt/entrar`
   - E-mail e senha temporária
   - Instrução: "Loga, clica no evento, arrasta as fotos. Cada uma até 30MB.
     Pode subir várias de uma vez."

---

## Etapa 6 — Durante e após o evento

- **Durante**: fotógrafos sobem fotos a qualquer hora. Como o evento está em
  **rascunho**, ninguém público vê ainda.
- **Encerramento**: depois de validar com a equipe que tudo subiu OK, admin
  vai em `/pt/admin/eventos` → clica **Publicar** no Favela + Rica 2026.
- A galeria pública em `/pt/galeria` mostra imediatamente o álbum.
- Visitantes abrem, navegam, baixam — sem cadastro.

---

## Troubleshooting

| Sintoma | Causa provável | Como verificar |
|---|---|---|
| `/entrar` mostra "ainda não configurado" | Faltam vars Supabase | Conferir `.env.local` e reiniciar dev |
| Login OK mas vai pra home (não admin) | `app_metadata.role` não foi setada | Voltar no Supabase Studio → user → Raw App Meta Data |
| Upload trava em "Preparando" | Vars R2 erradas ou bucket sem permissão | Testar curl: ver Network tab no /api/upload/sign |
| Upload trava em "Enviando" | CORS no R2 não liberado | R2 → bucket → Settings → CORS, adicionar origem |
| Foto sobe mas não aparece | `R2_PUBLIC_URL` errado ou bucket privado | Abrir a URL direto no browser; deve mostrar a imagem |
| Fotógrafo loga mas não vê evento | Falta atribuição | `/admin/fotografos` → expandir o usuário → marcar evento → Salvar |

### Configurar CORS no R2 (caso o upload do browser falhe)

R2 → bucket → **Settings** → **CORS Policy** → colar:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://institutoimpetus.com.br",
      "https://*.vercel.app"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Salvar. Propaga em ~1 min.

---

## Custos reais a monitorar

| Serviço | Free tier | Quando começa a cobrar |
|---|---|---|
| Supabase | 500MB DB · 50k MAU · 1GB egress/mês | Improvável estourar nos primeiros 1-2 anos |
| Cloudflare R2 | 10GB armazenado · sempre 0 egress | ~3.000 fotos a 3MB cada |
| Vercel | Hobby gratuito (ou Pro existente) | Tráfego comercial pode forçar Pro |

Painéis de billing:
- Supabase: Dashboard → **Reports** → **Database** + **Storage**
- Cloudflare: Dashboard → **Billing** → **R2 usage**
- Vercel: Dashboard → **Usage**

Sugestão: **revisar consumo na 2ª semana após o evento** — primeira leitura
real de tráfego.

---

## Renovação / manutenção

- **API token R2 sem TTL:** sem manutenção. Se setou 1 ano, marcar lembrete.
- **Database password Supabase:** trocar em rotação anual recomendada (não
  obrigatória).
- **Service role key Supabase:** se vazar, rotacionar imediatamente em
  Project Settings → API → Reset.
- **Backup do banco:** Supabase free não tem PITR; fazer export manual via
  Dashboard → Database → Backups → 1×/mês como hábito.
