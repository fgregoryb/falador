<template>
  <div style="min-height:100vh;background:var(--bg);display:flex;flex-direction:column;">
    <AppHeader />
    <main style="flex:1;">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
