<template>
  <span :style="`font-family: var(--font-display); font-size: ${size}px; font-weight: 500; letter-spacing: -0.02em; color: var(--text);`">
    Falador
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 20 })
</script>
