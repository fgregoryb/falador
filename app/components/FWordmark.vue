<template>
  <span style="display:inline-flex;align-items:center;gap:7px;line-height:1;">
    <svg
      :width="iconSize" :height="iconSize"
      viewBox="0 0 32 32" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style="display:block;flex:none;">
      <rect width="32" height="32" rx="8" fill="var(--accent)"/>
      <path d="M6 8a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H18l-4 4v-4H9a3 3 0 0 1-3-3V8z" fill="white"/>
    </svg>
    <span :style="`font-family:var(--font-display);font-size:${size}px;font-weight:500;letter-spacing:-0.02em;color:var(--text);line-height:1;`">
      Verbose
    </span>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number }>(), { size: 20 })
// SVG slightly smaller than text so optical baselines match
const iconSize = computed(() => Math.round(props.size * 0.95))
</script>
