# Design Brief — Blog CMS Pessoal

## Contexto

Estou construindo um **Blog CMS Pessoal** — uma plataforma onde eu publico conteúdo técnico e pessoal, com um painel de administração privado para gerenciar tudo. O backend já está 100% implementado com Nuxt 4 + Supabase. O que preciso agora é de um **redesign completo das interfaces**, com identidade visual forte, nome de marca, e um design que impressione visitantes e recrutadores.

---

## O que eu preciso de você

1. **Sugerir um nome para o meu blog/site** — algo memorável, que passe a ideia de conhecimento, escrita técnica ou identidade pessoal de desenvolvedor.
2. **Redesenhar as três interfaces principais** descritas abaixo, com visual moderno e profissional.
3. **Sugerir novas funcionalidades de UI** que façam sentido para cada área (sem necessidade de novo backend — o foco é na experiência visual).
4. **Definir uma identidade visual** consistente: paleta de cores, tipografia, estilo geral (minimalista premium, editorial tech, dark mode, etc.).

---

## Stack técnica (para o design respeitar as capacidades)

- **Frontend:** Nuxt 4 (Vue 3) + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Conteúdo:** posts escritos em **Markdown**, renderizados em HTML
- **Autenticação:** e-mail e senha (Supabase Auth)
- **Hospedagem:** a definir (provavelmente Vercel)

---

## As três interfaces a redesenhar

---

### 1. Área Pública — O Blog (o que visitantes e recrutadores veem)

**Páginas existentes:**
- **Home (`/`)** — listagem de posts publicados com título, resumo e data
- **Post individual (`/posts/[slug]`)** — conteúdo completo do post em Markdown renderizado
- **Sobre (`/sobre`)** — bio do autor, avatar, informações pessoais

**Problemas atuais:**
- Visual muito genérico e simplista — parece um template padrão
- Falta identidade visual e personalidade
- Não passa a impressão de um dev sério

**O que espero do redesign:**
- Aparência de um blog técnico de alto nível (referências: blog.vercel.com, overreacted.io, leerob.io)
- Tipografia forte e bem escolhida
- Home com hierarquia visual clara — o visitante deve saber imediatamente do que se trata o blog
- Post individual com leitura confortável, suporte a código (blocos `<code>` estilizados), e progresso de leitura
- Página "Sobre" que funcione como uma mini landing page pessoal — foto, bio, links (GitHub, LinkedIn, e-mail)
- Dark mode seria um diferencial enorme

**Funcionalidades de UI que podem ser adicionadas:**
- Barra de progresso de leitura no topo do post
- Tempo estimado de leitura ("5 min de leitura")
- Tags/categorias nos posts
- Botão de compartilhar post
- Seção de posts relacionados no final do post
- Newsletter signup (campo de e-mail simples, mesmo que decorativo por enquanto)
- Indicador de "novo post" nos cards da home

---

### 2. Tela de Login do Admin (`/admin/login`)

**Estado atual:**
- Formulário simples centralizado, sem personalidade
- Fundo cinza padrão
- Nenhuma identidade visual

**O que espero:**
- Login que pareça parte de um produto profissional, não um formulário genérico
- Pode ter um lado esquerdo com branding/identidade do blog e lado direito com o formulário
- Ou um design full-screen minimalista premium com o logo/nome no centro
- Feedback visual claro de loading e erro
- Animações sutis de entrada

---

### 3. Painel Admin (`/admin/*`)

**Páginas existentes:**
- **Dashboard (`/admin`)** — tabela de todos os posts com status, data, e ações (publicar, editar, deletar)
- **Novo post (`/admin/new`)** — formulário com título, resumo, editor de Markdown, preview
- **Editar post (`/admin/edit/[id]`)** — mesmo formulário pré-preenchido

**Problemas atuais:**
- Sidebar simples, sem hierarquia visual
- Dashboard parece uma tabela básica sem vida
- Editor de Markdown sem personalidade — parece um textarea comum
- Não passa a sensação de um CMS profissional

**O que espero:**
- Visual de um SaaS moderno — referências: Linear, Notion, Ghost CMS, Hashnode
- Dashboard com métricas visuais no topo (total de posts, publicados, rascunhos, visitas — mesmo que os números sejam mockados por enquanto)
- Tabela de posts com design mais rico: thumbnail/ícone por post, status com badges coloridos, ações inline elegantes
- Editor dividido em dois painéis lado a lado: esquerdo para escrever Markdown, direito com preview em tempo real
- Sidebar com avatar do usuário logado e informações básicas
- Transições e animações de página suaves

**Funcionalidades de UI que podem ser adicionadas ao admin:**
- Cards de estatísticas no topo do dashboard (posts publicados, rascunhos, mês de criação)
- Busca/filtro de posts na tabela
- Ordenação por coluna na tabela
- Confirmação de delete com modal elegante (em vez do `confirm()` nativo do browser)
- Toast notifications para feedback de ações ("Post publicado com sucesso!")
- Autosave indicator no editor ("Salvo automaticamente")
- Contador de palavras no editor
- Modo de foco no editor (esconde a sidebar)

---

## Identidade visual — sugestões de direção

Escolha **uma** das direções abaixo (ou proponha outra) e aplique consistentemente:

**A) Editorial Técnico** — tipografia serif para títulos, tons de off-white e preto profundo, detalhe em uma cor vibrante (laranja, verde-limão ou roxo). Remete a publicações sérias.

**B) Dark Mode Premium** — fundo quase-preto (#0a0a0a), texto branco suave, acentos em índigo ou ciano. Muito usado por devs, passa sofisticação.

**C) Minimalista Moderno** — muito espaço em branco, tipografia grande e arrojada, uma única cor de acento. Clean, fácil de ler, atemporal.

**D) Glassmorphism / Gradient** — fundos com gradiente suave, cards com efeito vidro, sombras coloridas. Visual mais jovem e contemporâneo.

---

## Restrições técnicas importantes

- Todo o estilo **deve ser implementável com Tailwind CSS** (classes utilitárias)
- Não usar bibliotecas de componentes que não sejam compatíveis com Vue 3 / Nuxt
- O backend **não precisa mudar** — apenas o visual das páginas
- Ícones podem ser adicionados via **Heroicons** ou **Lucide** (ambos têm integração com Vue)
- Fontes podem ser carregadas via **Google Fonts** (configurado no `nuxt.config.ts`)

---

## Entregáveis esperados

1. **Nome sugerido para o blog** — com justificativa
2. **Identidade visual escolhida** — paleta de cores, fontes, estilo
3. **Wireframes ou descrição detalhada** de cada uma das três interfaces
4. **Componentes-chave** a criar ou modificar, com descrição visual
5. **Código Tailwind de referência** para os principais elementos (opcional mas muito bem-vindo)

---

## Referências visuais que admiro

- [leerob.io](https://leerob.io) — blog pessoal de dev, minimalista e elegante
- [overreacted.io](https://overreacted.io) — foco total em leitura
- [Ghost CMS](https://ghost.org) — painel admin moderno e limpo
- [Linear](https://linear.app) — design de produto SaaS de alto nível
- [Hashnode](https://hashnode.com) — plataforma de blog para devs
