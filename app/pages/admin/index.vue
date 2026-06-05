<template>
  <div style="display:flex;flex-direction:column;height:100%;">
    <!-- Topbar -->
    <header style="height:64px;flex:none;border-bottom:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:space-between;padding:0 26px;">
      <div>
        <div style="font-size:16px;font-weight:600;font-family:var(--font-display);letter-spacing:-0.01em;">Painel</div>
        <div style="font-size:12.5px;color:var(--text-3);margin-top:1px;">Visão geral do seu blog</div>
      </div>
      <NuxtLink to="/admin/new" class="btn btn-primary btn-sm">
        <FIcon name="plus" :size="16" /> Novo post
      </NuxtLink>
    </header>

    <div style="flex:1;overflow-y:auto;padding:26px;max-width:1180px;width:100%;margin:0 auto;">

      <!-- Erro de carregamento -->
      <div v-if="fetchError" style="margin-bottom:20px;padding:14px 18px;border-radius:var(--radius-sm);background:color-mix(in srgb,#e5484d 10%,transparent);border:1px solid color-mix(in srgb,#e5484d 30%,transparent);color:#e5484d;font-size:13.5px;display:flex;align-items:center;gap:10px;">
        <FIcon name="alertCircle" :size="16" style="flex:none;" />
        Erro ao carregar posts: {{ fetchError.message }}
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px;">
        <div class="card" style="padding:20px 22px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <span style="width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--accent-weak);color:var(--accent);">
              <FIcon name="file" :size="19" />
            </span>
          </div>
          <div class="serif" style="font-size:32px;font-weight:500;letter-spacing:-0.02em;line-height:1;">{{ publishedCount }}</div>
          <div style="font-size:13px;color:var(--text-2);margin-top:6px;">Posts publicados</div>
        </div>
        <div class="card" style="padding:20px 22px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <span style="width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--surface-2);color:var(--text-2);">
              <FIcon name="pencil" :size="19" />
            </span>
          </div>
          <div class="serif" style="font-size:32px;font-weight:500;letter-spacing:-0.02em;line-height:1;">{{ draftCount }}</div>
          <div style="font-size:13px;color:var(--text-2);margin-top:6px;">Rascunhos</div>
        </div>
        <div class="card" style="padding:20px 22px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <span style="width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--surface-2);color:var(--text-2);">
              <FIcon name="list" :size="19" />
            </span>
          </div>
          <div class="serif" style="font-size:32px;font-weight:500;letter-spacing:-0.02em;line-height:1;">{{ totalCount }}</div>
          <div style="font-size:13px;color:var(--text-2);margin-top:6px;">Total de posts</div>
        </div>
        <div class="card" style="padding:20px 22px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <span style="width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--surface-2);color:var(--text-2);">
              <FIcon name="calendar" :size="19" />
            </span>
          </div>
          <div class="serif" style="font-size:32px;font-weight:500;letter-spacing:-0.02em;line-height:1;">{{ lastPostDate }}</div>
          <div style="font-size:13px;color:var(--text-2);margin-top:6px;">Último post</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:14px;flex-wrap:wrap;">
        <div style="display:flex;align-items:baseline;gap:12px;">
          <h2 class="serif" style="font-size:20px;font-weight:600;margin:0;">Seus posts</h2>
          <span style="color:var(--text-3);font-size:13px;font-family:var(--font-mono);">{{ filtered.length }} de {{ posts?.length ?? 0 }}</span>
        </div>
        <div style="display:flex;gap:9px;align-items:center;">
          <div style="position:relative;">
            <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text-3);display:grid;">
              <FIcon name="search" :size="15" />
            </span>
            <input v-model="query" class="field" placeholder="Buscar posts…" style="width:220px;padding:8px 12px 8px 34px;font-size:13.5px;" />
          </div>
          <div style="display:flex;background:var(--surface-2);border-radius:9px;padding:3px;border:1px solid var(--border);">
            <button v-for="[k, l] in filters" :key="k" @click="filterKey = k"
              :style="{border:'none',padding:'6px 11px',borderRadius:'7px',fontSize:'12.5px',fontWeight:'600',fontFamily:'var(--font-ui)',
              background: filterKey===k ? 'var(--surface)' : 'transparent',
              color: filterKey===k ? 'var(--text)' : 'var(--text-3)',
              boxShadow: filterKey===k ? 'var(--shadow-sm)' : 'none'}">{{ l }}</button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card" style="overflow:hidden;">
        <div style="display:grid;grid-template-columns:1fr 140px 120px 110px;gap:16px;padding:13px 22px;border-bottom:1px solid var(--border);background:var(--surface-2);">
          <span class="eyebrow">Título</span>
          <span class="eyebrow">Status</span>
          <span class="eyebrow">Data</span>
          <span class="eyebrow" style="text-align:right;">Ações</span>
        </div>

        <div v-if="pending" style="padding:46px;text-align:center;color:var(--text-3);font-size:13px;font-family:var(--font-mono);">
          Carregando…
        </div>
        <div v-else-if="filtered.length === 0" style="padding:46px;text-align:center;color:var(--text-3);">
          <FIcon name="search" :size="26" style="margin-bottom:10px;display:block;margin:0 auto 10px;" />
          <div style="font-size:14px;">Nenhum post encontrado.</div>
        </div>

        <div v-for="(post, i) in filtered" :key="post.id"
          :style="{
            display:'grid', gridTemplateColumns:'1fr 140px 120px 110px', gap:'16px',
            padding:'15px 22px', alignItems:'center', transition:'background .14s',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none'
          }"
          @mouseenter="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.background='var(--surface-2)'"
          @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.background='transparent'">
          <div style="display:flex;align-items:center;gap:13px;min-width:0;">
            <img :src="coverImage(post.slug, 84, 84)" :alt="post.title"
              style="width:42px;height:42px;border-radius:8px;flex:none;object-fit:cover;display:block;" loading="lazy" />
            <div style="min-width:0;">
              <div style="font-size:14.5px;font-weight:600;font-family:var(--font-display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ post.title }}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:3px;font-family:var(--font-mono);">{{ post.slug }}</div>
            </div>
          </div>
          <div>
            <button @click="toggleStatus(post)" :class="'badge badge-dot ' + (post.status === 'published' ? 'badge-pub' : 'badge-draft')" style="cursor:pointer;border:none;">
              {{ post.status === 'published' ? 'publicado' : 'rascunho' }}
            </button>
          </div>
          <div style="font-size:13px;color:var(--text-2);font-family:var(--font-mono);">{{ fmtDate(post.created_at) }}</div>
          <div style="display:flex;gap:2px;justify-content:flex-end;">
            <NuxtLink :to="`/admin/edit/${post.id}`" class="icon-btn" title="Editar">
              <FIcon name="pencil" :size="15" />
            </NuxtLink>
            <button class="icon-btn danger" @click="confirmDelete(post)" title="Excluir">
              <FIcon name="trash" :size="15" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete modal -->
    <div v-if="delPost" class="modal-scrim" @click="delPost = null">
      <div class="modal" @click.stop>
        <div style="width:46px;height:46px;border-radius:12px;background:color-mix(in srgb,#e5484d 12%,transparent);color:#e5484d;display:grid;place-items:center;margin-bottom:16px;">
          <FIcon name="trash" :size="22" />
        </div>
        <h3 class="serif" style="font-size:22px;font-weight:600;margin:0 0 8px;">Excluir este post?</h3>
        <p style="color:var(--text-2);font-size:14.5px;line-height:1.6;margin:0 0 22px;">
          "{{ delPost.title }}" será removido permanentemente. Essa ação não pode ser desfeita.
        </p>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button class="btn btn-ghost" @click="delPost = null">Cancelar</button>
          <button class="btn" @click="doDelete" style="background:#e5484d;color:#fff;border-color:#e5484d;">Excluir post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const query = ref('')
const filterKey = ref('todos')
const delPost = ref<{ id: string; title: string } | null>(null)
const filters = [['todos', 'Todos'], ['published', 'Publicados'], ['draft', 'Rascunhos']] as const

const { data: posts, pending, error: fetchError, refresh } = await useFetch('/api/admin/posts')

const publishedCount = computed(() => posts.value?.filter(p => p.status === 'published').length ?? 0)
const draftCount     = computed(() => posts.value?.filter(p => p.status === 'draft').length ?? 0)
const totalCount     = computed(() => posts.value?.length ?? 0)
const lastPostDate   = computed(() => {
  const published = posts.value?.filter(p => p.published_at).sort(
    (a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime()
  )
  if (!published?.length) return '—'
  const d = new Date(published[0].published_at!)
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
  return `${d.getDate()} ${months[d.getMonth()]}`
})

const filtered = computed(() => {
  if (!posts.value) return []
  return posts.value.filter(p =>
    (filterKey.value === 'todos' || p.status === filterKey.value) &&
    p.title.toLowerCase().includes(query.value.toLowerCase())
  )
})

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

async function toggleStatus(post: { id: string; status: string }) {
  const newStatus = post.status === 'published' ? 'draft' : 'published'
  await $fetch(`/api/admin/posts/${post.id}`, { method: 'PUT', body: { status: newStatus } })
  await refresh()
}

function confirmDelete(post: { id: string; title: string }) {
  delPost.value = post
}

async function doDelete() {
  if (!delPost.value) return
  await $fetch(`/api/admin/posts/${delPost.value.id}`, { method: 'DELETE' })
  delPost.value = null
  await refresh()
}
</script>
