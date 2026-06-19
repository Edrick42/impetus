# Supabase — galeria

## Como aplicar a migration

### Opção A: Studio (recomendado para o MVP)

1. Acessar https://supabase.com/dashboard/project/_/sql/new
2. Colar o conteúdo de `migrations/0001_gallery.sql`
3. Executar

### Opção B: CLI (`supabase` CLI instalada)

```bash
supabase link --project-ref <ref>
supabase db push
```

## Como criar o primeiro admin

Não há tela de cadastro pública. Cria-se o primeiro admin **direto no Supabase Studio**:

1. Auth → Users → "Add user" → e-mail + senha temporária
2. Clicar no usuário criado → editar `app_metadata`:
   ```json
   { "role": "admin" }
   ```
3. Salvar.

Esse admin pode então usar `/admin/fotografos` para criar outros usuários.

## Estrutura das policies

- **events**
  - Visitante anônimo: lê só `published = true`
  - Admin: tudo
- **event_photographers**
  - Fotógrafo: lê só as próprias atribuições
  - Admin: tudo
- **photos**
  - Visitante: lê fotos de eventos publicados
  - Fotógrafo: lê fotos de eventos a que está atribuído; INSERT só com `uploaded_by = self` e atribuição ativa
  - Admin: tudo

## Sobre a role no JWT

A role mora em `auth.users.app_metadata.role` (`'admin' | 'photographer'`). O JWT
do Supabase carrega esse campo automaticamente, e `public.has_role()` lê dele.

**Importante**: depois de mudar `app_metadata` de um usuário existente, ele
precisa **fazer login de novo** para o novo JWT ser emitido com a role.
