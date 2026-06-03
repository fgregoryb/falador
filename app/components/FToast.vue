<template>
  <Teleport to="body">
    <div v-if="message" class="toast-wrap">
      <div class="toast">
        <span style="width:20px;height:20px;border-radius:99px;background:var(--accent);color:#fff;display:grid;place-items:center;flex:none;">
          <FIcon name="check" :size="13" />
        </span>
        {{ message }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const message = ref('')
let timer: ReturnType<typeof setTimeout>

function notify(msg: string) {
  message.value = msg
  clearTimeout(timer)
  timer = setTimeout(() => { message.value = '' }, 2800)
}

defineExpose({ notify })
</script>
