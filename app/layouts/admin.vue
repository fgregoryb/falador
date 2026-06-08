<template>
  <div style="height:100vh;display:flex;background:var(--bg-tint);">
    <!-- Sidebar -->
    <aside style="width:244px;flex:none;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:20px 16px;">
      <div style="padding:6px 8px 20px;">
        <FWordmark :size="18" />
      </div>

      <nav style="display:flex;flex-direction:column;gap:3px;">
        <button v-for="item in navItems" :key="item.route"
          @click="navigateTo(item.path)"
          :style="{
            display:'flex', alignItems:'center', gap:'11px', padding:'9px 11px',
            borderRadius:'9px', border:'none', textAlign:'left', fontFamily:'var(--font-ui)',
            fontSize:'14px', fontWeight: isNavActive(item.route) ? '600' : '500',
            background: isNavActive(item.route) ? 'var(--accent-weak)' : 'transparent',
            color: isNavActive(item.route) ? 'var(--accent)' : 'var(--text-2)',
            transition:'all .14s var(--ease)',
          }"
          @mouseenter="(e: MouseEvent) => { if(!isNavActive(item.route)) { (e.currentTarget as HTMLElement).style.background='var(--surface-2)'; (e.currentTarget as HTMLElement).style.color='var(--text)'; } }"
          @mouseleave="(e: MouseEvent) => { if(!isNavActive(item.route)) { (e.currentTarget as HTMLElement).style.background='transparent'; (e.currentTarget as HTMLElement).style.color='var(--text-2)'; } }">
          <FIcon :name="item.icon" :size="17" />
          {{ item.label }}
          <span v-if="item.route === 'new'" style="margin-left:auto;">
            <FIcon name="plus" :size="14" />
          </span>
        </button>
      </nav>

      <div style="margin-top:auto;">
        <div style="display:flex;gap:6px;margin-bottom:8px;">
          <button @click="navigateTo('/')"
            style="flex:1;display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:9px;background:none;border:none;color:var(--text-2);font-size:13.5px;font-family:var(--font-ui);"
            @mouseenter="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color='var(--accent)'"
            @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color='var(--text-2)'">
            <FIcon name="arrowUpRight" :size="16" /> Ver site público
          </button>
          <button class="icon-btn" @click="toggleTheme" :title="theme === 'dark' ? 'Modo claro' : 'Modo escuro'"
            style="border:1px solid var(--border);">
            <FIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="16" />
          </button>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:12px;display:flex;align-items:center;gap:11px;">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--accent-weak);display:grid;place-items:center;color:var(--accent);font-family:var(--font-display);font-weight:600;font-size:15px;flex:none;">G</div>
          <div style="min-width:0;flex:1;">
            <div style="font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Gregory Rodrigues</div>
            <div style="font-size:11.5px;color:var(--text-3);font-family:var(--font-mono);">fgregoryb@gmail.com</div>
          </div>
          <button class="icon-btn" @click="logout" title="Sair">
            <FIcon name="logout" :size="16" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <div style="flex:1;min-width:0;display:flex;flex-direction:column;">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const { theme, toggleTheme } = useTheme()

const navItems = [
  { route: 'admin',    path: '/admin',               icon: 'file',     label: 'Painel' },
  { route: 'new',      path: '/admin/new',            icon: 'pencil',   label: 'Novo post' },
  { route: 'settings', path: '/admin/configuracoes',  icon: 'settings', label: 'Configurações' },
]

function isNavActive(r: string) {
  if (r === 'admin')    return route.path === '/admin'
  if (r === 'new')      return route.path.startsWith('/admin/new') || route.path.startsWith('/admin/edit')
  if (r === 'settings') return route.path.startsWith('/admin/configuracoes')
  return false
}

async function logout() {
  await supabase.auth.signOut()
  await navigateTo('/admin/login')
}
</script>
