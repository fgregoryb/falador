<template>
  <div class="card" style="padding:30px 32px;">
    <div class="eyebrow" style="margin-bottom:10px;">Newsletter</div>
    <h3 class="serif" style="font-size:25px;font-weight:600;margin:0 0 8px;letter-spacing:-0.01em;">
      Receba os posts no e-mail
    </h3>
    <p style="color:var(--text-2);font-size:15px;margin:0 0 18px;max-width:440px;line-height:1.6;">
      Um e-mail quando sai algo novo. Sem spam, sem "growth hacks". Só o post.
    </p>
    <div v-if="done" style="display:flex;align-items:center;gap:10px;color:#2a9d5c;font-weight:600;font-size:15px;">
      <span style="width:24px;height:24px;border-radius:99px;background:color-mix(in srgb,#2a9d5c 15%,transparent);display:grid;place-items:center;">
        <FIcon name="check" :size="15" />
      </span>
      Pronto! Você está na lista.
    </div>
    <form v-else @submit.prevent="submit" style="display:flex;gap:9px;max-width:440px;">
      <input v-model="email" class="field" type="email" placeholder="seu@email.com" style="flex:1;" />
      <button class="btn btn-primary" type="submit" style="flex:none;">Assinar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const done = ref(false)
function submit() {
  if (email.value.includes('@')) done.value = true
}
</script>
