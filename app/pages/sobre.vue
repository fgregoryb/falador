<template>
  <section style="max-width:760px;margin:0 auto;padding:72px 32px 0;">
    <div v-if="pending" style="color:var(--text-3);font-family:var(--font-mono);font-size:13px;">Carregando…</div>

    <template v-else-if="profile">
      <div class="rise" style="display:flex;align-items:center;gap:24px;margin-bottom:40px;flex-wrap:wrap;">
        <div style="width:92px;height:92px;border-radius:50%;overflow:hidden;background:var(--accent-weak);border:2px solid var(--surface);box-shadow:0 0 0 1px var(--border-2);display:grid;place-items:center;flex:none;">
          <img v-if="profile.avatar_url" :src="profile.avatar_url" :alt="profile.name"
            style="width:100%;height:100%;object-fit:cover;" />
          <span v-else style="color:var(--accent);font-family:var(--font-display);font-weight:600;font-size:36px;">
            {{ (profile.name || 'G').charAt(0).toUpperCase() }}
          </span>
        </div>
        <div>
          <div class="eyebrow" style="margin-bottom:10px;">Sobre</div>
          <h1 class="serif" style="font-size:clamp(32px,4.5vw,44px);font-weight:500;letter-spacing:-0.025em;line-height:1.05;margin:0;">
            {{ profile.name }}
          </h1>
          <div style="display:flex;align-items:center;gap:10px;margin-top:12px;color:var(--text-2);font-size:15px;flex-wrap:wrap;">
            <span>Desenvolvedor Full-Stack</span>
            <span v-if="locationLabel" style="color:var(--text-3);">·</span>
            <span v-if="locationLabel" style="font-family:var(--font-mono);font-size:13px;">{{ locationLabel }}</span>
          </div>
        </div>
      </div>

      <div class="prose rise" style="animation-delay:.06s;font-size:20px;">
        <p>{{ profile.bio }}</p>
      </div>

      <div style="margin:44px 0 0;">
        <div class="eyebrow" style="margin-bottom:16px;">Ferramentas do dia a dia</div>
        <div style="display:flex;flex-wrap:wrap;gap:9px;">
          <span v-for="s in stack" :key="s" class="tag" style="font-size:13px;padding:7px 13px;">{{ s }}</span>
        </div>
      </div>

      <div v-if="socialLinks.length" style="margin:44px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <a v-for="link in socialLinks" :key="link.icon" :href="link.href" target="_blank" rel="noreferrer"
          class="card" style="display:flex;align-items:center;gap:14px;padding:18px 20px;transition:all .18s var(--ease);"
          @mouseenter="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.borderColor='var(--accent-line)'; (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; }"
          @mouseleave="(e: MouseEvent) => { (e.currentTarget as HTMLElement).style.borderColor='var(--border)'; (e.currentTarget as HTMLElement).style.transform='none'; }">
          <span style="width:42px;height:42px;border-radius:10px;background:var(--surface-2);display:grid;place-items:center;color:var(--text-2);flex:none;">
            <FIcon :name="link.icon" :size="19" />
          </span>
          <div style="min-width:0;">
            <div style="font-size:14.5px;font-weight:600;">{{ link.label }}</div>
            <div style="font-size:13px;color:var(--text-3);font-family:var(--font-mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ link.display }}</div>
          </div>
          <FIcon name="arrowUpRight" :size="16" style="margin-left:auto;color:var(--text-3);" />
        </a>
      </div>

      <div style="margin:44px 0 0;">
        <NewsletterBlock />
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
const [{ data: profile, pending }, { data: siteSettings }] = await Promise.all([
  useFetch('/api/profile'),
  useFetch('/api/settings'),
])

useSeoMeta({
  title: () => profile.value ? `Sobre — ${profile.value.name}` : 'Sobre',
  description: () => profile.value?.bio ?? '',
})

// Location from the dedicated field in settings (not derived from timezone)
const locationLabel = computed(() => (siteSettings.value as any)?.location ?? '')

const stack = ['Vue 3', 'Nuxt 4', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Node.js']

// Social links from settings — only show filled ones
const socialLinks = computed(() => {
  const s = siteSettings.value as any
  if (!s) return []

  const map = [
    { key: 'github_url',    icon: 'github',    label: 'GitHub' },
    { key: 'linkedin_url',  icon: 'linkedin',  label: 'LinkedIn' },
    { key: 'twitter_url',   icon: 'twitter',   label: 'X / Twitter' },
    { key: 'instagram_url', icon: 'instagram', label: 'Instagram' },
    { key: 'facebook_url',  icon: 'facebook',  label: 'Facebook' },
  ]

  return map
    .filter(m => s[m.key])
    .map(m => ({
      icon:    m.icon,
      label:   m.label,
      href:    s[m.key] as string,
      display: (s[m.key] as string)
        .replace('https://github.com/', '@')
        .replace('https://linkedin.com/in/', '')
        .replace('https://x.com/', '@')
        .replace('https://twitter.com/', '@')
        .replace('https://instagram.com/', '@')
        .replace('https://facebook.com/', ''),
    }))
})
</script>
