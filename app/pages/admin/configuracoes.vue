<template>
  <div style="display:flex;flex-direction:column;height:100%;">

    <!-- Topbar -->
    <header style="height:64px;flex:none;border-bottom:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:space-between;padding:0 26px;">
      <div>
        <div style="font-size:16px;font-weight:600;font-family:var(--font-display);letter-spacing:-0.01em;">Configurações</div>
        <div style="font-size:12.5px;color:var(--text-3);margin-top:1px;">Perfil, site, redes sociais e aparência</div>
      </div>
      <button class="btn btn-primary btn-sm" :disabled="saving" @click="saveAll">
        <FIcon :name="saving ? 'clock' : 'save'" :size="15" />
        {{ saving ? 'Salvando…' : 'Salvar alterações' }}
      </button>
    </header>

    <div style="flex:1;overflow-y:auto;">
      <div style="padding:32px;max-width:860px;width:100%;margin:0 auto;">

        <!-- Banners -->
        <div v-if="successMsg" style="margin-bottom:20px;padding:13px 16px;border-radius:var(--radius-sm);background:color-mix(in srgb,#2a9d5c 10%,transparent);border:1px solid color-mix(in srgb,#2a9d5c 30%,transparent);color:#2a9d5c;font-size:13.5px;display:flex;align-items:center;gap:9px;">
          <FIcon name="check" :size="15" /> {{ successMsg }}
        </div>
        <div v-if="errorMsg" style="margin-bottom:20px;padding:13px 16px;border-radius:var(--radius-sm);background:color-mix(in srgb,#e5484d 10%,transparent);border:1px solid color-mix(in srgb,#e5484d 30%,transparent);color:#e5484d;font-size:13.5px;display:flex;align-items:center;gap:9px;">
          <FIcon name="alertCircle" :size="15" /> {{ errorMsg }}
        </div>

        <!-- ══ GERAL ══ -->
        <div class="eyebrow" style="margin-bottom:12px;">Geral</div>
        <section class="card" style="padding:24px;margin-bottom:28px;">

          <!-- Avatar com ajuste -->
          <div style="display:flex;align-items:flex-start;gap:20px;margin-bottom:22px;padding-bottom:22px;border-bottom:1px solid var(--border);flex-wrap:wrap;">
            <!-- Preview circular -->
            <div style="position:relative;flex:none;">
              <div style="width:80px;height:80px;border-radius:50%;overflow:hidden;background:var(--accent-weak);display:grid;place-items:center;border:2px solid var(--border-2);">
                <img v-if="profile.avatar_url" :src="profile.avatar_url" alt="Foto de perfil" style="width:100%;height:100%;object-fit:cover;" />
                <span v-else style="font-family:var(--font-display);font-size:28px;font-weight:600;color:var(--accent);">
                  {{ (profile.name || 'G').charAt(0).toUpperCase() }}
                </span>
              </div>
              <!-- Botão editar sobre o avatar -->
              <button v-if="profile.avatar_url" @click="openCropper"
                style="position:absolute;bottom:0;right:0;width:26px;height:26px;border-radius:50%;background:var(--accent);border:2px solid var(--surface);display:grid;place-items:center;cursor:pointer;">
                <FIcon name="pencil" :size="11" style="color:#fff;" />
              </button>
            </div>

            <div style="flex:1;min-width:200px;">
              <label class="field-label">Foto de perfil</label>
              <div style="display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">
                <input ref="avatarInput" type="file" accept="image/jpeg,image/png,image/webp" style="display:none;" @change="onFileSelected" />
                <button class="btn btn-ghost btn-sm" :disabled="uploading.avatar" @click="(avatarInput as HTMLInputElement)?.click()">
                  <FIcon :name="uploading.avatar ? 'clock' : 'arrowUpRight'" :size="14" />
                  {{ uploading.avatar ? 'Enviando…' : 'Escolher imagem' }}
                </button>
                <span style="font-size:12px;color:var(--text-3);font-family:var(--font-mono);">JPG, PNG, WebP · máx. 2 MB</span>
              </div>
              <input v-model="profile.avatar_url" class="field" placeholder="Ou cole uma URL de imagem…" style="font-size:13px;" />
            </div>
          </div>

          <!-- Nome + Bio + Site -->
          <div style="display:grid;gap:16px;">
            <div>
              <label class="field-label">Nome completo *</label>
              <input v-model="profile.name" class="field" placeholder="Seu nome" />
            </div>
            <div>
              <label class="field-label">Bio <span style="color:var(--text-3);font-weight:400;">— aparece na página Sobre e nos posts</span></label>
              <textarea v-model="profile.bio" class="field" rows="3" style="resize:vertical;line-height:1.6;" placeholder="Escreva um parágrafo sobre você…" />
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
              <div>
                <label class="field-label">Nome do site *</label>
                <input v-model="settings.site_name" class="field" placeholder="Verbose" />
              </div>
              <div>
                <label class="field-label">E-mail de contato</label>
                <input v-model="settings.contact_email" class="field" type="email" placeholder="voce@email.com" />
              </div>
            </div>
            <div>
              <label class="field-label">Descrição do site</label>
              <textarea v-model="settings.site_description" class="field" rows="2" style="resize:vertical;" placeholder="Notas de um desenvolvedor sobre Vue, Nuxt e banco de dados." />
            </div>
          </div>
        </section>

        <!-- ══ APARÊNCIA ══ -->
        <div class="eyebrow" style="margin-bottom:12px;">Aparência</div>
        <section class="card" style="padding:24px;margin-bottom:28px;">
          <label class="field-label" style="margin-bottom:14px;display:block;">Tema</label>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <button v-for="t in (['light', 'dark'] as const)" :key="t" @click="setTheme(t)"
              :style="{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'8px',
                padding:'16px 28px', borderRadius:'var(--radius-sm)', border:'2px solid',
                borderColor: theme === t ? 'var(--accent)' : 'var(--border)',
                background: theme === t ? 'var(--accent-weak)' : 'var(--surface-2)',
                cursor:'pointer', transition:'all .16s var(--ease)', minWidth:'100px',
              }">
              <FIcon :name="t === 'dark' ? 'moon' : 'sun'" :size="20"
                :style="{ color: theme === t ? 'var(--accent)' : 'var(--text-2)' }" />
              <span :style="{ fontSize:'13px', fontWeight:'600', color: theme === t ? 'var(--accent)' : 'var(--text-2)' }">
                {{ t === 'light' ? 'Claro' : 'Escuro' }}
              </span>
            </button>
          </div>
        </section>

        <!-- ══ LOCALIZAÇÃO ══ -->
        <div class="eyebrow" style="margin-bottom:12px;">Localização</div>
        <section class="card" style="padding:24px;margin-bottom:28px;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
            <div>
              <label class="field-label">Idioma</label>
              <select v-model="settings.language" class="field" style="cursor:pointer;width:100%;">
                <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                <option value="pt-PT">🇵🇹 Português (Portugal)</option>
                <option value="en-US">🇺🇸 English (US)</option>
                <option value="en-GB">🇬🇧 English (UK)</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="it">🇮🇹 Italiano</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="zh-CN">🇨🇳 中文 (简体)</option>
              </select>
            </div>
            <div>
              <label class="field-label">Fuso horário</label>
              <select v-model="settings.timezone" class="field" style="cursor:pointer;width:100%;">
                <optgroup label="América do Sul">
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Belem">Belém (GMT-3)</option>
                  <option value="America/Fortaleza">Fortaleza (GMT-3)</option>
                  <option value="America/Recife">Recife (GMT-3)</option>
                  <option value="America/Porto_Velho">Porto Velho (GMT-4)</option>
                  <option value="America/Boa_Vista">Boa Vista (GMT-4)</option>
                  <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                  <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
                  <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
                  <option value="America/Santiago">Santiago (GMT-4)</option>
                  <option value="America/Bogota">Bogotá (GMT-5)</option>
                  <option value="America/Lima">Lima (GMT-5)</option>
                  <option value="America/Caracas">Caracas (GMT-4)</option>
                </optgroup>
                <optgroup label="América do Norte">
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="America/Chicago">Chicago (GMT-6)</option>
                  <option value="America/Denver">Denver (GMT-7)</option>
                  <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
                  <option value="America/Toronto">Toronto (GMT-5)</option>
                  <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                </optgroup>
                <optgroup label="Europa">
                  <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
                  <option value="Europe/London">Londres (GMT+0)</option>
                  <option value="Europe/Paris">Paris (GMT+1)</option>
                  <option value="Europe/Berlin">Berlim (GMT+1)</option>
                  <option value="Europe/Madrid">Madri (GMT+1)</option>
                  <option value="Europe/Rome">Roma (GMT+1)</option>
                  <option value="Europe/Moscow">Moscou (GMT+3)</option>
                </optgroup>
                <optgroup label="Ásia / Pacífico">
                  <option value="Asia/Dubai">Dubai (GMT+4)</option>
                  <option value="Asia/Kolkata">Mumbai / Nova Deli (GMT+5:30)</option>
                  <option value="Asia/Bangkok">Bancoc (GMT+7)</option>
                  <option value="Asia/Shanghai">Xangai (GMT+8)</option>
                  <option value="Asia/Singapore">Cingapura (GMT+8)</option>
                  <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                  <option value="Australia/Sydney">Sydney (GMT+11)</option>
                </optgroup>
                <optgroup label="Universal">
                  <option value="UTC">UTC (GMT+0)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </section>

        <!-- ══ REDES SOCIAIS ══ -->
        <div class="eyebrow" style="margin-bottom:12px;">Redes sociais</div>
        <section class="card" style="padding:24px;margin-bottom:28px;">
          <div style="display:grid;gap:14px;">
            <div v-for="net in socialNetworks" :key="net.key"
              style="display:grid;grid-template-columns:minmax(130px,160px) 1fr;gap:12px;align-items:center;">
              <div style="display:flex;align-items:center;gap:9px;color:var(--text-2);font-size:13.5px;font-weight:500;">
                <span style="width:30px;height:30px;border-radius:8px;background:var(--surface-2);display:grid;place-items:center;border:1px solid var(--border);flex:none;">
                  <FIcon :name="net.icon" :size="15" />
                </span>
                {{ net.label }}
              </div>
              <input v-model="(settings as any)[net.key]" class="field" :placeholder="net.placeholder" style="font-size:13.5px;min-width:0;" />
            </div>
          </div>
        </section>

      </div>
    </div>

    <!-- ══ MODAL CROPPER ══ -->
    <div v-if="cropperOpen" class="modal-scrim" @click.self="closeCropper">
      <div class="modal" style="width:min(480px,94vw);padding:28px;">
        <h3 class="serif" style="font-size:20px;font-weight:600;margin:0 0 6px;">Ajustar foto de perfil</h3>
        <p style="font-size:13.5px;color:var(--text-2);margin:0 0 20px;">Arraste para reposicionar · Scroll ou slider para zoom</p>

        <!-- Canvas preview circular -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:20px;">
          <div
            ref="cropZone"
            style="width:240px;height:240px;border-radius:50%;overflow:hidden;border:3px solid var(--accent);background:var(--surface-2);cursor:grab;position:relative;flex:none;"
            @mousedown="startDrag" @touchstart.prevent="startDrag"
            @wheel.prevent="onWheel">
            <img
              v-if="cropSrc"
              :src="cropSrc"
              draggable="false"
              :style="{
                position:'absolute',
                width: cropNatW * cropZoom + 'px',
                height: cropNatH * cropZoom + 'px',
                left: cropX + 'px',
                top: cropY + 'px',
                userSelect:'none',
                pointerEvents:'none',
              }"
              @load="onCropImgLoad"
              ref="cropImg"
            />
          </div>

          <!-- Zoom slider -->
          <div style="width:100%;display:flex;align-items:center;gap:12px;">
            <FIcon name="minimize" :size="14" style="color:var(--text-3);flex:none;" />
            <input type="range" v-model.number="cropZoom"
              :min="cropZoomMin" :max="cropZoomMin * 3" :step="0.01"
              style="flex:1;accent-color:var(--accent);" />
            <FIcon name="maximize" :size="14" style="color:var(--text-3);flex:none;" />
          </div>
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:22px;">
          <button class="btn btn-ghost" @click="closeCropper">Cancelar</button>
          <button class="btn btn-primary" :disabled="uploading.avatar" @click="applyCrop">
            <FIcon :name="uploading.avatar ? 'clock' : 'check'" :size="15" />
            {{ uploading.avatar ? 'Salvando…' : 'Aplicar recorte' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { theme, toggleTheme } = useTheme()
const avatarInput = ref<HTMLInputElement | null>(null)
const saving      = ref(false)
const uploading   = reactive({ avatar: false })
const successMsg  = ref('')
const errorMsg    = ref('')

// ── Social networks — add new ones here ──
const socialNetworks = [
  { key: 'github_url',    icon: 'github',    label: 'GitHub',      placeholder: 'https://github.com/usuario' },
  { key: 'linkedin_url',  icon: 'linkedin',  label: 'LinkedIn',    placeholder: 'https://linkedin.com/in/usuario' },
  { key: 'instagram_url', icon: 'instagram', label: 'Instagram',   placeholder: 'https://instagram.com/usuario' },
  { key: 'facebook_url',  icon: 'facebook',  label: 'Facebook',    placeholder: 'https://facebook.com/usuario' },
  { key: 'twitter_url',   icon: 'twitter',   label: 'X / Twitter', placeholder: 'https://x.com/usuario' },
]

const profile  = reactive({ name: '', bio: '', avatar_url: '' })
const settings = reactive({
  site_name: 'Verbose', site_description: '', contact_email: '',
  timezone: 'America/Sao_Paulo', language: 'pt-BR',
  github_url: '', linkedin_url: '', instagram_url: '', facebook_url: '', twitter_url: '',
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

// ── FILE SELECTION ──
function onFileSelected(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { errorMsg.value = 'Arquivo muito grande. Máximo 2 MB.'; return }
  const url = URL.createObjectURL(file)
  openCropperWith(url)
}

// ── CROPPER ──
const cropperOpen = ref(false)
const cropSrc     = ref('')
const cropImg     = ref<HTMLImageElement | null>(null)
const cropZone    = ref<HTMLElement | null>(null)
const cropX       = ref(0)
const cropY       = ref(0)
const cropZoom    = ref(1)
const cropZoomMin = ref(1)
const cropNatW    = ref(0)
const cropNatH    = ref(0)

const CROP_SIZE = 240

function openCropper() {
  if (profile.avatar_url) openCropperWith(profile.avatar_url)
}

function openCropperWith(src: string) {
  cropSrc.value    = src
  cropX.value      = 0
  cropY.value      = 0
  cropZoom.value   = 1
  cropperOpen.value = true
}

function closeCropper() {
  cropperOpen.value = false
}

function onCropImgLoad() {
  const img = cropImg.value
  if (!img) return
  cropNatW.value = img.naturalWidth
  cropNatH.value = img.naturalHeight
  // Minimum zoom: image fills the circle
  const minZ = Math.max(CROP_SIZE / img.naturalWidth, CROP_SIZE / img.naturalHeight)
  cropZoomMin.value = minZ
  cropZoom.value    = minZ
  // Center
  cropX.value = (CROP_SIZE - img.naturalWidth  * minZ) / 2
  cropY.value = (CROP_SIZE - img.naturalHeight * minZ) / 2
}

// Drag
let dragging = false, dragStartX = 0, dragStartY = 0, dragOriginX = 0, dragOriginY = 0

function startDrag(e: MouseEvent | TouchEvent) {
  dragging    = true
  const pt    = 'touches' in e ? e.touches[0] : e
  dragStartX  = pt.clientX
  dragStartY  = pt.clientY
  dragOriginX = cropX.value
  dragOriginY = cropY.value

  const onMove = (ev: MouseEvent | TouchEvent) => {
    if (!dragging) return
    const p  = 'touches' in ev ? ev.touches[0] : ev
    const dx = p.clientX - dragStartX
    const dy = p.clientY - dragStartY
    cropX.value = clampX(dragOriginX + dx)
    cropY.value = clampY(dragOriginY + dy)
  }
  const onUp = () => { dragging = false; window.removeEventListener('mousemove', onMove as any); window.removeEventListener('mouseup', onUp); window.removeEventListener('touchmove', onMove as any); window.removeEventListener('touchend', onUp) }
  window.addEventListener('mousemove', onMove as any)
  window.addEventListener('mouseup', onUp)
  window.addEventListener('touchmove', onMove as any, { passive: false })
  window.addEventListener('touchend', onUp)
}

function onWheel(e: WheelEvent) {
  const delta = -e.deltaY * 0.001
  cropZoom.value = Math.max(cropZoomMin.value, Math.min(cropZoomMin.value * 3, cropZoom.value + delta))
  cropX.value = clampX(cropX.value)
  cropY.value = clampY(cropY.value)
}

function clampX(x: number) {
  const w = cropNatW.value * cropZoom.value
  return Math.min(0, Math.max(CROP_SIZE - w, x))
}
function clampY(y: number) {
  const h = cropNatH.value * cropZoom.value
  return Math.min(0, Math.max(CROP_SIZE - h, y))
}

async function applyCrop() {
  if (import.meta.server) return
  uploading.avatar = true
  errorMsg.value   = ''

  try {
    const canvas  = document.createElement('canvas')
    const OUTPUT  = 400
    canvas.width  = OUTPUT
    canvas.height = OUTPUT
    const ctx     = canvas.getContext('2d')!
    const scale   = OUTPUT / CROP_SIZE

    // Clip circle
    ctx.beginPath()
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2)
    ctx.clip()

    // Draw image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = cropSrc.value })
    ctx.drawImage(img, cropX.value * scale, cropY.value * scale, cropNatW.value * cropZoom.value * scale, cropNatH.value * cropZoom.value * scale)

    const blob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), 'image/jpeg', 0.92))
    const fd   = new FormData()
    fd.append('file', blob, 'avatar.jpg')
    fd.append('bucket', 'avatars')

    const result = await $fetch<{ url: string }>('/api/admin/upload', { method: 'POST', body: fd })
    profile.avatar_url = result.url
    closeCropper()
    successMsg.value = 'Foto atualizada! Clique em "Salvar alterações" para confirmar.'
    setTimeout(() => { successMsg.value = '' }, 4000)
  } catch (err: any) {
    errorMsg.value = err?.data?.message ?? 'Erro ao processar imagem.'
  } finally {
    uploading.avatar = false
  }
}

// ── SAVE ──
async function saveAll() {
  if (!profile.name.trim())       { errorMsg.value = 'Nome é obrigatório.'; return }
  if (!settings.site_name.trim()) { errorMsg.value = 'Nome do site é obrigatório.'; return }

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
