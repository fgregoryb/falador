<template>
  <div style="height:100vh;display:grid;grid-template-columns:1.05fr 1fr;background:var(--bg);">
    <!-- Brand panel (sempre dark) -->
    <div data-theme="dark" style="position:relative;overflow:hidden;background:var(--bg);display:flex;flex-direction:column;justify-content:space-between;padding:46px 52px;">
      <div style="position:absolute;inset:0;opacity:.5;background-image:repeating-linear-gradient(135deg,transparent 0 26px,rgba(255,106,61,.05) 26px 27px);" />
      <div style="position:absolute;width:360px;height:360px;right:-120px;top:-120px;border-radius:50%;background:radial-gradient(circle,var(--accent-weak),transparent 70%);" />

      <div style="position:relative;">
        <FWordmark :size="22" />
      </div>

      <div style="position:relative;max-width:440px;" class="rise">
        <FIcon name="quote" :size="40" style="color:var(--accent);margin-bottom:18px;" />
        <p class="serif" style="font-size:30px;line-height:1.32;font-weight:400;color:var(--text);letter-spacing:-0.01em;margin:0;">
          Bons editores não chamam atenção para si. Eles desaparecem atrás do texto.
        </p>
        <div style="margin-top:22px;color:var(--text-3);font-family:var(--font-mono);font-size:13px;">
          — do post sobre o editor de Markdown
        </div>
      </div>

      <div style="position:relative;display:flex;gap:18px;color:var(--text-3);font-family:var(--font-mono);font-size:12px;">
        <span>painel privado</span>
      </div>
    </div>

    <!-- Form -->
    <div style="display:grid;place-items:center;padding:40px;position:relative;background:var(--bg);">
      <NuxtLink to="/" class="btn btn-ghost btn-sm" style="position:absolute;top:28px;right:28px;">
        <FIcon name="arrowRight" :size="14" style="transform:rotate(180deg);" /> Voltar ao site
      </NuxtLink>

      <form @submit.prevent="login" class="rise" style="width:min(360px,100%);">
        <div style="margin-bottom:30px;">
          <h1 class="serif" style="font-size:30px;font-weight:500;letter-spacing:-0.02em;margin:0 0 8px;">Entrar no painel</h1>
          <p style="color:var(--text-2);font-size:14.5px;margin:0;">Acesse para gerenciar seus posts.</p>
        </div>

        <div v-if="errorMsg" class="fade" style="display:flex;align-items:center;gap:9px;background:color-mix(in srgb,#e5484d 9%,transparent);border:1px solid color-mix(in srgb,#e5484d 28%,transparent);color:#e5484d;padding:10px 13px;border-radius:10px;font-size:13.5px;font-weight:500;margin-bottom:18px;">
          <FIcon name="x" :size="15" /> {{ errorMsg }}
        </div>

        <div style="margin-bottom:16px;">
          <label class="field-label">E-mail</label>
          <input v-model="email" class="field" type="email" placeholder="voce@email.com" required />
        </div>
        <div style="margin-bottom:22px;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <label class="field-label">Senha</label>
            <button type="button" @click="showPass = !showPass" style="background:none;border:none;color:var(--text-3);font-size:12px;font-family:var(--font-mono);">
              {{ showPass ? 'ocultar' : 'mostrar' }}
            </button>
          </div>
          <input v-model="password" class="field" :type="showPass ? 'text' : 'password'" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading" style="width:100%;justify-content:center;padding:12px;">
          <span v-if="loading" class="spin" style="width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:99px;display:inline-block;" />
          <span v-else>Entrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const showPass = ref(false)

async function login() {
  loading.value = true
  errorMsg.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    errorMsg.value = 'Credenciais inválidas. Tente novamente.'
    loading.value = false
    return
  }

  await router.push('/admin')
}
</script>
