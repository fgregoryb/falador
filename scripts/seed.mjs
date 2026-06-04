import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lbyngfjbfpldeokasrad.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxieW5nZmpiZnBsZGVva2FzcmFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM0ODQ0OSwiZXhwIjoyMDk1OTI0NDQ5fQ.U6C7JaJ1q9L6oFytTox2uPJFFigzuEDSS0ELIt-jIL0'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Get the first user to assign as author
const { data: users } = await supabase.auth.admin.listUsers()
const author = users?.users?.[0]

if (!author) {
  console.error('Nenhum usuário encontrado. Crie uma conta no painel admin primeiro.')
  process.exit(1)
}

console.log(`Usando autor: ${author.email} (${author.id})`)

const posts = [
  {
    title: 'Como o Nuxt 4 mudou minha forma de estruturar projetos Vue',
    slug: 'nuxt-4-estrutura-projetos-vue',
    excerpt: 'A nova convenção de diretórios do Nuxt 4 parece pequena, mas muda tudo sobre como penso a organização de um projeto.',
    content: `## O problema que eu não sabia que tinha

Durante anos, estruturei projetos Vue da mesma forma: tudo na raiz, \`pages/\` aqui, \`components/\` ali. Funcionava. Mas quando o Nuxt 4 introduziu o diretório \`app/\`, percebi que havia uma separação que eu nunca havia feito conscientemente: **código de aplicação** vs. **código de servidor**.

## A virada de chave

Com Nuxt 4, a estrutura ficou assim:

\`\`\`
meu-projeto/
├── app/           ← tudo do cliente (Vue)
│   ├── pages/
│   ├── components/
│   └── composables/
└── server/        ← tudo do servidor (Nitro)
    └── api/
\`\`\`

Parece cosmético. Não é. Essa separação física força você a pensar antes de criar um arquivo: *isso roda no browser ou no servidor?*

## Por que isso importa na prática

Quando estava no Nuxt 3, era fácil importar um utilitário do servidor dentro de um componente acidentalmente. O bundler ignorava em desenvolvimento, mas explodia em produção. Com a separação do Nuxt 4, essa classe de erro desaparece.

Além disso, o autocomplete da IDE ficou melhor. O TypeScript consegue inferir o contexto de cada arquivo com muito mais precisão.

## O que mudei nos meus projetos

1. **Composables de servidor** ficam em \`server/utils/\`, não em \`app/composables/\`
2. **Validação compartilhada** vai em um pacote separado (ou \`shared/\`)
3. **Tipos do banco de dados** ficam em \`server/types/\`, gerados pelo Supabase CLI

Pequenas mudanças. Grande diferença na clareza mental.`,
    status: 'published',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'RLS no Supabase: o que aprendi errando em produção',
    slug: 'supabase-rls-aprendizado-producao',
    excerpt: 'Row Level Security é uma das features mais poderosas do Supabase — e uma das mais fáceis de errar. Aqui está o que me custou horas de debug.',
    content: `## O que é RLS, brevemente

Row Level Security (RLS) é uma feature do PostgreSQL que permite definir regras de acesso por linha. O Supabase expõe isso de forma elegante pelo painel, mas a complexidade está nos detalhes.

## O erro clássico que cometi

Criei uma tabela \`posts\`, habilitei o RLS, e esqueci de criar políticas. Resultado: **nenhuma linha retornava**, mesmo com o usuário autenticado. O Supabase não lança um erro — simplesmente retorna array vazio.

Passei horas pensando que minha query estava errada.

## A regra que aprendi

> RLS habilitado sem políticas = acesso negado para todos, sempre.

Para operações de leitura pública, você precisa de uma política explícita:

\`\`\`sql
create policy "posts públicos são visíveis"
on posts for select
using (status = 'published');
\`\`\`

## Service Role vs Anon Key

Outro ponto que me pegou: o **service role key bypassa o RLS completamente**. Isso é útil para operações administrativas (seeds, migrations), mas perigoso se exposto no client-side.

A regra prática:
- \`anon key\` → frontend, respeita RLS
- \`service role key\` → backend/servidor apenas, nunca no browser

## Como estruturei no projeto atual

Para operações admin (criar, editar, deletar posts), uso o service role **apenas nas server routes do Nuxt**. O cliente nunca toca nessa chave.

\`\`\`ts
// server/api/admin/posts/index.post.ts
const client = serverSupabaseServiceRole(event) // ok, roda no servidor
\`\`\`

Simples assim. Mas demorei mais do que gostaria para chegar nessa clareza.`,
    status: 'published',
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Server Routes no Nuxt: por que parei de usar APIs separadas',
    slug: 'nuxt-server-routes-sem-api-separada',
    excerpt: 'Por muito tempo mantive um backend Express separado do frontend Nuxt. Hoje uso Server Routes e não volto atrás.',
    content: `## O setup antigo

Por anos, meu stack padrão era:

- Frontend: Nuxt (ou Vue puro)
- Backend: Express.js rodando em outra porta
- Deploy: dois serviços, dois Dockerfiles, dois processos de CI

Funcionava. Mas era burocrático. Qualquer mudança de contrato de API exigia mexer em dois projetos.

## O que mudou com o Nitro

O Nuxt 3+ inclui o **Nitro** como engine de servidor. Isso significa que qualquer arquivo em \`server/api/\` vira um endpoint automaticamente.

\`\`\`ts
// server/api/posts/index.get.ts
export default defineEventHandler(async (event) => {
  const posts = await getPosts()
  return posts
})
\`\`\`

Esse arquivo vira \`GET /api/posts\`. Sem configuração, sem roteamento manual.

## Vantagens que sinto no dia a dia

**1. TypeScript end-to-end**: posso importar os mesmos tipos no cliente e no servidor sem criar um pacote compartilhado.

**2. Deploy único**: um \`npm run build\` gera tudo. Um serviço no Vercel ou Railway serve o frontend e a API.

**3. Menos contexto mental**: não preciso lembrar em qual projeto está cada coisa.

## Quando ainda usaria um backend separado

Para sistemas grandes, com times distintos de frontend e backend, ou quando a API precisa ser consumida por múltiplos clientes (mobile, outros frontends), um backend separado ainda faz sentido.

Para projetos de um desenvolvedor ou times pequenos? Server Routes ganham fácil.`,
    status: 'published',
    published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'O que TypeScript me ensinou sobre pensar em contratos',
    slug: 'typescript-contratos-entre-modulos',
    excerpt: 'Depois de dois anos escrevendo TypeScript sério, a maior mudança não foi na qualidade do código — foi na forma como penso sobre sistemas.',
    content: `## Antes do TypeScript

Quando comecei a programar profissionalmente, JavaScript puro era o padrão. Eu escrevia funções assim:

\`\`\`js
function getUser(id) {
  return fetch(\`/api/users/\${id}\`).then(r => r.json())
}
\`\`\`

E usava assim:

\`\`\`js
const user = await getUser(123)
console.log(user.name) // vai dar certo, né?
\`\`\`

Às vezes dava. Às vezes não.

## O contrato explícito

TypeScript me forçou a ser explícito:

\`\`\`ts
interface User {
  id: number
  name: string
  email: string
}

async function getUser(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`)
  return res.json()
}
\`\`\`

Agora quem usa essa função sabe exatamente o que vai receber. E o compilador garante que eu não vou acessar \`user.nome\` (typo em PT-BR) sem perceber.

## A mudança de mentalidade

O mais valioso não é o autocomplete. É que TypeScript me obriga a **definir o contrato antes de implementar**.

Antes de escrever uma função, preciso pensar: o que ela recebe? O que ela retorna? O que pode dar errado?

Esse hábito melhorou meu código muito além do TypeScript. Hoje faço a mesma pergunta em qualquer linguagem.

## O que TypeScript não resolve

TypeScript verifica tipos em tempo de compilação. Em runtime, se a API retornar um formato inesperado, seu \`Promise<User>\` vai ter os dados errados sem nenhum aviso.

Para isso, uso **Zod** na fronteira do sistema (validação de dados externos). TypeScript cuida do interior; Zod cuida da entrada.`,
    status: 'published',
    published_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Composables Vue: o padrão que mais uso e por quê',
    slug: 'vue-composables-padrao-favorito',
    excerpt: 'Composables são a feature mais poderosa do Vue 3 na minha opinião. Mas existe uma forma de escrevê-los que faz toda a diferença.',
    content: `## O que são composables

Composables são funções que encapsulam lógica reativa do Vue. São o equivalente aos hooks do React — mas com algumas diferenças importantes.

\`\`\`ts
// composables/usePosts.ts
export function usePosts() {
  const posts = ref<Post[]>([])
  const loading = ref(false)

  async function fetch() {
    loading.value = true
    posts.value = await $fetch('/api/posts')
    loading.value = false
  }

  return { posts, loading, fetch }
}
\`\`\`

## O padrão que adotei

Sempre retorno um objeto, nunca um array. Isso permite desestruturar com nomes descritivos:

\`\`\`ts
// ✅ Bom
const { posts, loading, fetch: fetchPosts } = usePosts()

// ❌ Evito
const [posts, loading] = usePosts()
\`\`\`

Arrays forçam a lembrar a ordem. Objetos são autodocumentados.

## Composable de estado global

Uma coisa pouco documentada: composables com estado no nível de módulo (fora da função) são singletons. Isso cria estado global de forma elegante:

\`\`\`ts
const globalTheme = ref<'light' | 'dark'>('light')

export function useTheme() {
  function toggle() {
    globalTheme.value = globalTheme.value === 'light' ? 'dark' : 'light'
  }
  return { theme: globalTheme, toggle }
}
\`\`\`

Qualquer componente que chama \`useTheme()\` compartilha o mesmo \`globalTheme\`.

## Quando não usar composables

Para lógica puramente derivada (computed de um computed), mantenho inline no componente. Composable cria uma abstração — abstrações têm custo de leitura. Só vale o custo quando a lógica é reutilizada em 2+ lugares.`,
    status: 'published',
    published_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Deploy com zero downtime: o que aprendi fazendo errado primeiro',
    slug: 'deploy-zero-downtime-aprendizado',
    excerpt: 'Meus primeiros deploys derrubavam o site por 30 segundos. Hoje uso uma abordagem que mantém tudo no ar durante a atualização.',
    content: `## O deploy ingênuo

No começo, meu fluxo era:

1. Parar o servidor
2. Atualizar o código
3. Reiniciar o servidor

Durante os passos 1-3, o site ficava fora. Para um projeto pessoal, tudo bem. Para produção com usuários reais, um problema.

## O que é zero downtime deployment

A ideia é simples: você sempre tem pelo menos uma instância saudável rodando enquanto a nova versão sobe.

As plataformas modernas (Vercel, Netlify, Railway) fazem isso automaticamente. Mas entender o mecanismo ajuda quando você precisa fazer na mão.

## A estratégia blue-green simplificada

Imagine que você tem dois ambientes: **blue** (atual) e **green** (novo).

1. Deploy da nova versão vai para **green**
2. Testes no **green** enquanto **blue** serve o tráfego
3. Load balancer muda o tráfego de **blue** para **green**
4. **Blue** fica de standby (rollback rápido se precisar)

## O que o Vercel faz por baixo

Cada deploy no Vercel cria uma URL única (ex: \`falador-abc123.vercel.app\`). Quando você "promove" um deploy para produção, o domínio principal aponta para a nova URL instantaneamente via DNS/CDN.

A URL antiga continua funcionando. Se algo der errado, um clique em "Instant Rollback" reverte.

## A lição principal

Infraestrutura não precisa ser complexa para ser confiável. Plataformas como Vercel abstraem décadas de boas práticas. Para a maioria dos projetos, o tempo é melhor gasto no produto do que na infraestrutura.`,
    status: 'published',
    published_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'PostgreSQL vs NoSQL: quando escolho cada um',
    slug: 'postgresql-vs-nosql-quando-escolher',
    excerpt: 'Já usei MongoDB, Firestore, Redis e PostgreSQL em produção. Hoje tenho uma heurística simples para escolher entre eles.',
    content: `## A pergunta que me fazem sempre

"Qual banco de dados você usa?" Como se existisse uma resposta universal.

A resposta honesta é: **depende**. Mas "depende" sem critério não ajuda ninguém. Então aqui está meu processo de decisão.

## Minha heurística

**Escolho PostgreSQL quando:**
- Os dados têm relações (usuários → posts → comentários)
- Preciso de transações (dinheiro, estoque, qualquer coisa que não pode ficar inconsistente)
- A estrutura dos dados é conhecida com antecedência
- Preciso de queries complexas (JOINs, agregações, full-text search)

**Escolho Redis quando:**
- Cache
- Sessões
- Filas de jobs
- Pub/sub em tempo real

**Escolho Firestore/DynamoDB quando:**
- Escala global com latência ultra-baixa é um requisito
- Os dados são naturalmente hierárquicos e raramente fazem JOIN
- O time não tem experiência com SQL

## O erro que cometi

Em 2022, escolhi MongoDB para um projeto porque "NoSQL escala melhor". O projeto nunca passou de 1.000 usuários. Pagamos o preço de queries complexas sem JOINs por meses.

Escalabilidade prematura é tão prejudicial quanto otimização prematura.

## A regra simples

Para 90% dos projetos que já trabalhei, **PostgreSQL foi a escolha certa**. Ele é mais flexível do que parece: tem suporte a JSON, arrays, full-text search, e escalou bem até centenas de milhões de registros nas empresas onde trabalhei.

Comece com Postgres. Mude quando tiver um motivo concreto para mudar.`,
    status: 'published',
    published_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Minha configuração de desenvolvimento em 2025',
    slug: 'configuracao-desenvolvimento-2025',
    excerpt: 'As ferramentas que uso todo dia, por que as escolhi, e o que mudei nos últimos 12 meses.',
    status: 'draft',
    content: `## Editor

VS Code com tema **GitHub Dark Default** e fonte **JetBrains Mono** em 15px. Simples. Já testei Neovim, Zed e Cursor — sempre volto para o VS Code pela quantidade de extensões maduras.

Extensões que não consigo viver sem:
- **ESLint** + **Prettier**: formatação automática ao salvar
- **Volar**: suporte Vue/Nuxt
- **GitLens**: blame inline é indispensável
- **Error Lens**: erros inline ao lado do código

## Terminal

**iTerm2** com **Oh My Zsh** e tema **Powerlevel10k**. Aliases que uso constantemente:

\`\`\`bash
alias dev="npm run dev"
alias build="npm run build"
alias gst="git status"
alias gco="git checkout"
alias gcm="git commit -m"
\`\`\`

## Gerenciador de pacotes

**pnpm** em projetos pessoais, **npm** quando preciso de compatibilidade máxima. O pnpm é visivelmente mais rápido e o disco agradece.

## Stack padrão atual

- **Nuxt 4** para fullstack Vue
- **Supabase** para banco + auth + storage
- **Vercel** para deploy
- **Tailwind CSS** para estilização

Essa combinação permite ir do zero a produção em horas, sem DevOps.

## O que mudei em 2025

Parei de usar **Vuex**. Pinia + composables resolvem 95% dos casos com muito menos boilerplate.

Comecei a usar **Zod** para validação em todas as bordas do sistema. TypeScript cuida dos tipos internos; Zod cuida dos dados externos.`,
    published_at: null,
  },
]

let created = 0
let skipped = 0

for (const post of posts) {
  const { error } = await supabase.from('posts').insert({
    ...post,
    author_id: author.id,
  })

  if (error) {
    if (error.code === '23505') {
      console.log(`⚠️  Já existe: "${post.title}"`)
      skipped++
    } else {
      console.error(`❌ Erro em "${post.title}":`, error.message)
    }
  } else {
    console.log(`✅ Criado: "${post.title}"`)
    created++
  }
}

console.log(`\nConcluído: ${created} criados, ${skipped} ignorados (já existiam).`)
