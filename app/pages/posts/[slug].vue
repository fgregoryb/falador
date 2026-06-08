<template>
  <div>
    <div v-if="pending" style="max-width:720px;margin:0 auto;padding:60px 32px;color:var(--text-3);font-family:var(--font-mono);font-size:13px;">
      Carregando artigo…
    </div>

    <article v-else-if="post" style="max-width:var(--maxw);margin:0 auto;padding:0 32px;position:relative;">
      <div style="max-width:720px;margin:0 auto;padding:56px 0 0;">
        <div class="rise">
          <h1 class="serif" style="font-size:clamp(34px,4.4vw,46px);font-weight:500;line-height:1.1;letter-spacing:-0.025em;margin:0;">
            {{ post.title }}
          </h1>
          <p v-if="post.excerpt" style="font-size:19px;color:var(--text-2);line-height:1.6;margin:20px 0 0;">
            {{ post.excerpt }}
          </p>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin:28px 0 0;padding-bottom:30px;border-bottom:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:42px;height:42px;border-radius:50%;background:var(--accent-weak);display:grid;place-items:center;color:var(--accent);font-family:var(--font-display);font-weight:600;font-size:18px;">
                G
              </div>
              <div>
                <div style="font-weight:600;font-size:14.5px;">Gregory Rodrigues</div>
                <div style="color:var(--text-3);font-size:13px;font-family:var(--font-mono);">
                  {{ fmtDateLong(post.published_at) }}
                </div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" @click="copyLink">
              <FIcon :name="copied ? 'check' : 'share'" :size="15" />
              {{ copied ? 'Link copiado' : 'Compartilhar' }}
            </button>
          </div>
        </div>

        <img v-if="(post as any).show_cover !== false"
          :src="coverImage(post.slug, 1200, 600)" :alt="post.title"
          class="fade"
          style="width:100%;height:300px;object-fit:cover;border-radius:var(--radius);display:block;margin:34px 0 12px;"
          loading="lazy" />

        <div class="prose" style="padding-top:22px;" v-html="renderMarkdown(post.content)" />

        <!-- Share footer -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;margin:48px 0 0;padding:28px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
          <span style="color:var(--text-2);font-size:14.5px;">Gostou? Compartilhe ou me chame pra conversar.</span>
          <div style="display:flex;gap:8px;">
            <a href="https://x.com/fgregoryb" target="_blank" rel="noreferrer" class="btn btn-ghost btn-icon"><FIcon name="twitter" :size="16" /></a>
            <a href="https://linkedin.com/in/fgregoryb" target="_blank" rel="noreferrer" class="btn btn-ghost btn-icon"><FIcon name="linkedin" :size="16" /></a>
            <button class="btn btn-subtle btn-sm" @click="copyLink"><FIcon name="copy" :size="15" /> Copiar link</button>
          </div>
        </div>

        <!-- Author card -->
        <div class="card" style="display:flex;gap:18px;padding:24px;margin:34px 0 60px;align-items:flex-start;">
          <div style="width:56px;height:56px;border-radius:50%;background:var(--accent-weak);display:grid;place-items:center;color:var(--accent);font-family:var(--font-display);font-weight:600;font-size:22px;flex:none;">
            G
          </div>
          <div style="flex:1;">
            <div class="eyebrow" style="margin-bottom:6px;">Escrito por</div>
            <div style="font-weight:600;font-size:16px;font-family:var(--font-display);">Gregory Rodrigues</div>
            <p style="color:var(--text-2);font-size:14px;line-height:1.6;margin:7px 0 12px;">
              Construo produtos web com Vue, Nuxt e um carinho exagerado por detalhe.
            </p>
            <NuxtLink to="/sobre" class="btn btn-ghost btn-sm">
              Mais sobre mim <FIcon name="arrowUpRight" :size="14" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const copied = ref(false)

const { data: post, pending, error } = await useFetch(`/api/posts/slug/${route.params.slug}`)

if (error.value) {
  throw createError({ statusCode: 404, message: 'Artigo não encontrado', fatal: true })
}

useSeoMeta({
  title: () => post.value?.title ?? 'Artigo',
  description: () => post.value?.excerpt ?? '',
})

function fmtDateLong(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function copyLink() {
  if (import.meta.client) {
    navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1800)
  }
}
</script>
