<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />

    <main class="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
