<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <FToast ref="toast" />
  </div>
</template>

<script setup lang="ts">
const { initTheme } = useTheme()
onMounted(() => initTheme())
</script>
