<template>
  <div style="display:flex;flex-direction:column;height:100%;">
    <header style="height:64px;flex:none;border-bottom:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:space-between;padding:0 26px;">
      <div>
        <div style="font-size:16px;font-weight:600;font-family:var(--font-display);letter-spacing:-0.01em;">Configurações</div>
        <div style="font-size:12.5px;color:var(--text-3);margin-top:1px;">Perfil, site e aparência</div>
      </div>
      <button class="btn btn-primary btn-sm" :disabled="saving" @click="saveAll">
        <FIcon :name="saving ? 'clock' : 'save'" :size="15" />
        {{ saving ? 'Salvando…' : 'Salvar alterações' }}
      </button>
    </header>

    <div style="flex:1;overflow-y:auto;padding:32px;max-width:900px;width:100%;margin:0 auto;">

      <div v-if="successMsg" style="margin-bottom:20px;padding:13px 16px;border-radius:var(--radius-sm);background:color-mix(in srgb,#2a9d5c 10%,transparent);border:1px solid color-mix(in srgb,#2a9d5c 30%,transparent);color:#2a9d5c;font-size:13.5px;display:flex;align-items:center;gap:9px;">
        <FIcon name="check" :size="15" /> {{ successMsg }}
      </div>
      <div v-if="errorMsg" style="margin-bottom:20px;padding:13px 16px;border-radius:var(--radius-sm);background:color-mix(in srgb,#e5484d 10%,transparent);border:1px solid color-mix(in srgb,#e5484d 30%,transparent);color:#e5484d;font-size:13.5px;display:flex;align-items:center;gap:9px;">
        <FIcon name="alertCircle" :size="15" /> {{ errorMsg }}
      </div>

      <!-- ── PERFIL ── -->
      <div class="eyebrow" style="margin-bottom:12px;">Perfil do autor</div>
      <section class="card" style="padding:24px;margin-bottom:28px;">
        <!-- Avatar -->
        <div style="display:flex;align-items:center;gap:20px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border);">
          <div style="width:72px;height:72px;border-radius:50%;overflow:hidden;background:var(--accent-weak);display:grid;place-items:center;flex:none;border:2px solid var(--border);">
            <img v-if="profile.avatar_url" :src="profile.avatar_url" alt="Avatar" style="width:100%;height:100%;object-fit:cover;" />
            <span v-else style="font-family:var(--font-display);font-size:26px;font-weight:600;color:var(--accent);">
              {{ (profile.name || 'G').charAt(0).toUpperCase() }}
            </span>
          </div>
          <div style="flex:1;">
            <label class="field-label">URL da foto de perfil</label>
            <input v-model="profile.avatar_url" class="field" placeholder="https://exemplo.com/foto.jpg" />
            <p style="font-size:12px;color:var(--text-3);margin:6px 0 0;font-family:var(--font-mono);">
              Cole a URL de uma foto hospedada (GitHub, LinkedIn, etc.)
            </p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <label class="field-label">Nome completo *</label>
            <input v-model="profile.name" class="field" placeholder="Seu nome" />
          </div>
          <div style="grid-column:1/-1;">
            <label class="field-label">Bio <span style="color:var(--text-3);font-weight:400;">— aparece na página Sobre e nos posts</span></label>
            <textarea v-model="profile.bio" class="field" rows="3" style="resize:vertical;line-height:1.6;" placeholder="Escreva um parágrafo sobre você…" />
          </div>
        </div>
      </section>

      <!-- ── SITE ── -->
      <div class="eyebrow" style="margin-bottom:12px;">Configurações do site</div>
      <section class="card" style="padding:24px;margin-bottom:28px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <label class="field-label">Nome do site *</label>
            <input v-model="settings.site_name" class="field" placeholder="Verbose" />
          </div>
          <div>
            <label class="field-label">E-mail de contato</label>
            <input v-model="settings.contact_email" class="field" type="email" placeholder="voce@email.com" />
          </div>
          <div style="grid-column:1/-1;">
            <label class="field-label">Descrição do site</label>
            <textarea v-model="settings.site_description" class="field" rows="2" style="resize:vertical;"
              placeholder="Notas de um desenvolvedor sobre Vue, Nuxt e banco de dados." />
          </div>
          <div>
            <label class="field-label">Idioma</label>
            <select v-model="settings.language" class="field" style="cursor:pointer;">
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
          <div>
            <label class="field-label">Fuso horário</label>
            <select v-model="settings.timezone" class="field" style="cursor:pointer;">
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
              <option value="America/Belem">Belém (GMT-3)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </section>

      <!-- ── APARÊNCIA ── -->
      <div class="eyebrow" style="margin-bottom:12px;">Aparência</div>
      <section class="card" style="padding:24px;">
        <p style="font-size:13.5px;color:var(--text-2);margin:0 0 18px;">Tema do painel e do site público.</p>
        <div style="display:flex;gap:12px;">
          <button v-for="t in (['light', 'dark'] as const)" :key="t" @click="setTheme(t)"
            :style="{
              display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
              padding:'20px 32px', borderRadius:'var(--radius-sm)', border:'2px solid',
              borderColor: theme === t ? 'var(--accent)' : 'var(--border)',
              background: theme === t ? 'var(--accent-weak)' : 'var(--surface-2)',
              cursor:'pointer', transition:'all .16s var(--ease)',
            }">
            <FIcon :name="t === 'dark' ? 'moon' : 'sun'" :size="22"
              :style="{ color: theme === t ? 'var(--accent)' : 'var(--text-2)' }" />
            <span :style="{ fontSize:'13px', fontWeight:'600', color: theme === t ? 'var(--accent)' : 'var(--text-2)' }">
              {{ t === 'light' ? 'Claro' : 'Escuro' }}
            </span>
          </button>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { theme, toggleTheme } = useTheme()
const saving     = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')

const profile  = reactive({ name: '', bio: '', avatar_url: '' })
const settings = reactive({
  site_name:        'Verbose',
  site_description: '',
  contact_email:    '',
  timezone:         'America/Sao_Paulo',
  language:         'pt-BR',
  logo_url:         '',
})

const [{ data: profileData }, { data: settingsData }] = await Promise.all([
  useFetch('/api/admin/profile'),
  useFetch('/api/admin/settings'),
])

if (profileData.value)  Object.assign(profile,  profileData.value)
if (settingsData.value) Object.assign(settings, settingsData.value)

function setTheme(t: 'light' | 'dark') {
  if (theme.value !== t) toggleTheme()
}

async function saveAll() {
  if (!profile.name.trim())        { errorMsg.value = 'Nome é obrigatório.'; return }
  if (!settings.site_name.trim())  { errorMsg.value = 'Nome do site é obrigatório.'; return }

  saving.value     = true
  successMsg.value = ''
  errorMsg.value   = ''

  try {
    await Promise.all([
      $fetch('/api/admin/profile',  { method: 'PUT', body: { ...profile } }),
      $fetch('/api/admin/settings', { method: 'PUT', body: { ...settings } }),
    ])
    successMsg.value = 'Configurações salvas com sucesso!'
    setTimeout(() => { successMsg.value = '' }, 3000)
  } catch (err: any) {
    errorMsg.value = err?.data?.message ?? 'Erro ao salvar. Tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>
