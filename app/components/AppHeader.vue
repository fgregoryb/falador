<template>
  <header style="position:sticky;top:0;z-index:40;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);">
    <div style="max-width:var(--maxw);margin:0 auto;padding:0 32px;height:66px;display:flex;align-items:center;justify-content:space-between;">
      <NuxtLink to="/">
        <FWordmark :size="19" />
      </NuxtLink>

      <nav style="display:flex;align-items:center;gap:6px;">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to"
          style="padding:8px 13px;border-radius:8px;font-size:14.5px;font-weight:500;transition:color .15s;"
          :style="{ color: isActive(item.to) ? 'var(--text)' : 'var(--text-2)' }"
          @mouseenter="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = 'var(--text)'"
          @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = isActive(item.to) ? 'var(--text)' : 'var(--text-2)'">
          {{ item.label }}
        </NuxtLink>

        <div style="width:1px;height:22px;background:var(--border);margin:0 8px;" />

        <a href="https://github.com/fgregoryb" target="_blank" rel="noreferrer" class="icon-btn" aria-label="GitHub">
          <FIcon name="github" :size="17" />
        </a>

        <button class="icon-btn" @click="toggleTheme" aria-label="Alternar tema"
          style="width:38px;height:38px;border-radius:10px;border:1px solid var(--border);background:var(--surface);">
          <FIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="18" />
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { theme, toggleTheme } = useTheme()

const nav = [
  { to: '/', label: 'Artigos' },
  { to: '/sobre', label: 'Sobre' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>
