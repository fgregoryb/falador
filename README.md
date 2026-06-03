# Blog CMS Pessoal

Blog pessoal com painel de administração, construído com Nuxt 4, Tailwind CSS e Supabase.

## Funcionalidades

**Área pública**
- Listagem de posts publicados com SSR (Server-Side Rendering)
- Página individual de post com conteúdo em Markdown
- Página "Sobre" com informações do autor
- SEO configurado em todas as páginas

**Painel Admin** (rota protegida)
- Autenticação com e-mail e senha via Supabase Auth
- Listagem de todos os posts (publicados e rascunhos)
- Criar post com editor Markdown e preview em tempo real
- Editar post existente
- Publicar e despublicar posts
- Deletar posts

## Stack

- **[Nuxt 4](https://nuxt.com/)** — framework Vue com SSR e Server Routes (Nitro)
- **[Tailwind CSS](https://tailwindcss.com/)** — estilização com classes utilitárias
- **[Supabase](https://supabase.com/)** — banco de dados PostgreSQL, autenticação e segurança via RLS
- **[Marked](https://marked.js.org/)** — renderização de Markdown para HTML

## Como rodar localmente

**Pré-requisitos:** Node.js 22+ e uma conta no Supabase.

1. Clone o repositório e instale as dependências:

```bash
git clone <url-do-repo>
cd blog-cms
nvm use        # ativa Node 22 via .nvmrc
npm install
```

2. Crie o arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-anon-key
```

3. No painel do Supabase, crie as tabelas executando o SQL disponível na seção abaixo.

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Estrutura do projeto

```
blog-cms/
├── app/
│   ├── components/     # AppHeader, AppFooter, PostForm
│   ├── layouts/        # default (público) e admin (painel)
│   ├── middleware/     # auth.ts — protege rotas /admin
│   ├── pages/          # rotas automáticas por arquivo
│   │   ├── index.vue        # home pública
│   │   ├── sobre.vue        # página sobre
│   │   ├── posts/[slug].vue # post individual
│   │   └── admin/           # painel de administração
│   └── utils/          # generateSlug, renderMarkdown
└── server/
    ├── api/            # endpoints REST (Nitro)
    └── utils/          # utilitários do servidor
```
