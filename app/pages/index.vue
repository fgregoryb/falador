<template>
  <div>
    <!-- Hero -->
    <section style="max-width:var(--maxw);margin:0 auto;padding:72px 32px 30px;">
      <div class="rise" style="max-width:760px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:22px;">
          <span class="badge badge-dot" style="color:var(--accent);border-color:var(--accent-line);background:var(--accent-weak);">
            escrevendo desde 2024
          </span>
          <span style="color:var(--text-3);font-size:13.5px;font-family:var(--font-mono);">
            {{ posts?.length ?? 0 }} artigos
          </span>
        </div>
        <h1 class="serif" style="font-size:clamp(40px,5.2vw,62px);font-weight:500;line-height:1.06;letter-spacing:-0.025em;margin:0;">
          Penso melhor<br />quando escrevo.
        </h1>
        <p style="font-size:19px;line-height:1.6;color:var(--text-2);max-width:540px;margin:26px 0 0;">
          Notas de um desenvolvedor sobre Vue, Nuxt, banco de dados e as decisões pequenas
          que fazem produto bom. Sem fórmula, sem pressa.
        </p>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="pending" style="max-width:var(--maxw);margin:0 auto;padding:40px 32px;color:var(--text-3);font-family:var(--font-mono);font-size:13px;">
      Carregando artigos…
    </div>

    <template v-else-if="posts && posts.length">
      <!-- Featured (primeiro post) -->
      <section style="max-width:var(--maxw);margin:0 auto;padding:14px 32px;">
        <NuxtLink :to="`/posts/${posts[0].slug}`"
          class="card rise"
          style="display:grid;grid-template-columns:1.05fr 1fr;overflow:hidden;animation-delay:.06s;transition:box-shadow .2s var(--ease),transform .2s var(--ease);"
          @mouseenter="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.boxShadow='var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; }"
          @mouseleave="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.boxShadow='var(--shadow-sm)'; (e.currentTarget as HTMLElement).style.transform='none'; }">
          <div style="padding:38px 40px;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;gap:8px;align-items:center;margin-bottom:18px;">
                <span class="badge badge-new badge-dot">novo</span>
                <span class="badge">★ em destaque</span>
              </div>
              <h2 class="serif" style="font-size:34px;font-weight:500;line-height:1.12;letter-spacing:-0.02em;margin:0 0 16px;">
                {{ posts[0].title }}
              </h2>
              <p style="color:var(--text-2);font-size:16px;line-height:1.65;margin:0;">{{ posts[0].excerpt }}</p>
            </div>
            <div style="display:flex;align-items:center;gap:14px;margin-top:28px;color:var(--text-3);font-size:13.5px;font-family:var(--font-mono);">
              <span>{{ fmtDate(posts[0].published_at) }}</span>
            </div>
          </div>
          <div class="ph-img" style="min-height:320px;border-radius:0;border-top:none;border-right:none;border-bottom:none;">
            <span>capa do artigo</span>
          </div>
        </NuxtLink>
      </section>

      <!-- List -->
      <section style="max-width:var(--maxw);margin:0 auto;padding:40px 32px 10px;">
        <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px;border-bottom:1px solid var(--border);padding-bottom:16px;">
          <h3 class="serif" style="font-size:22px;font-weight:600;margin:0;letter-spacing:-0.01em;">Mais recentes</h3>
          <span class="eyebrow">{{ new Date().getFullYear() }}</span>
        </div>
        <div>
          <NuxtLink v-for="post in posts.slice(1)" :key="post.slug" :to="`/posts/${post.slug}`"
            style="display:grid;grid-template-columns:120px 1fr auto;gap:28px;align-items:start;border-bottom:1px solid var(--border);padding:26px 0;transition:padding .2s var(--ease);"
            @mouseenter="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.paddingLeft='14px'; }"
            @mouseleave="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.paddingLeft='0'; }">
            <div style="padding-top:4px;">
              <div style="font-family:var(--font-mono);font-size:12.5px;color:var(--text-3);">{{ fmtDate(post.published_at) }}</div>
            </div>
            <div>
              <h4 class="serif" style="font-size:23px;font-weight:500;margin:0 0 7px;line-height:1.2;letter-spacing:-0.015em;transition:color .15s;color:var(--text);">
                {{ post.title }}
              </h4>
              <p style="color:var(--text-2);font-size:14.5px;line-height:1.6;margin:0;">{{ post.excerpt }}</p>
            </div>
            <div style="padding-top:6px;color:var(--accent);">
              <FIcon name="arrowRight" :size="18" />
            </div>
          </NuxtLink>
        </div>
      </section>
    </template>

    <p v-else style="max-width:var(--maxw);margin:40px auto;padding:0 32px;color:var(--text-3);">
      Nenhum artigo publicado ainda.
    </p>

    <!-- Newsletter -->
    <section style="max-width:var(--maxw);margin:0 auto;padding:44px 32px 0;">
      <NewsletterBlock />
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Artigos',
  description: 'Notas de um desenvolvedor sobre Vue, Nuxt, banco de dados e as decisões pequenas que fazem produto bom.',
})

const { data: posts, pending } = await useFetch('/api/posts')

function fmtDate(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}
</script>
