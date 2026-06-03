<template>
  <footer style="border-top:1px solid var(--border);margin-top:40px;">
    <div style="max-width:var(--maxw);margin:0 auto;padding:40px 32px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px;">
      <div style="max-width:300px;">
        <FWordmark :size="17" />
        <p style="color:var(--text-3);font-size:13.5px;line-height:1.6;margin:14px 0 0;">
          Notas de um dev que gosta de pensar em voz alta.
        </p>
      </div>
      <div style="display:flex;gap:60px;">
        <div>
          <div class="eyebrow" style="margin-bottom:14px;">Navegar</div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            <NuxtLink v-for="item in links" :key="item.to" :to="item.to"
              style="color:var(--text-2);font-size:13.5px;transition:color .15s;"
              @mouseenter="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'"
              @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
        <div>
          <div class="eyebrow" style="margin-bottom:14px;">Contato</div>
          <div style="display:flex;gap:8px;">
            <a v-for="s in social" :key="s.icon" :href="s.href" target="_blank" rel="noreferrer"
              style="width:36px;height:36px;border-radius:9px;border:1px solid var(--border);display:grid;place-items:center;color:var(--text-2);background:var(--surface);transition:all .16s var(--ease);"
              @mouseenter="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-line)'; }"
              @mouseleave="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }">
              <FIcon :name="s.icon" :size="16" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid var(--border);padding:18px 32px;max-width:var(--maxw);margin:0 auto;">
      <span style="color:var(--text-3);font-size:12.5px;font-family:var(--font-mono);">
        © {{ new Date().getFullYear() }} Gregory Rodrigues · feito com Nuxt + Supabase
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const links = [
  { to: '/', label: 'Artigos' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/admin/login', label: 'Admin' },
]
const social = [
  { icon: 'github', href: 'https://github.com/fgregoryb' },
  { icon: 'linkedin', href: 'https://linkedin.com/in/fgregoryb' },
  { icon: 'twitter', href: 'https://x.com/fgregoryb' },
  { icon: 'mail', href: 'mailto:ola@falador.dev' },
]
</script>
