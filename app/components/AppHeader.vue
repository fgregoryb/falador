<template>
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-3xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
      <NuxtLink to="/" class="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
        Meu Blog
      </NuxtLink>

      <nav class="flex gap-6">
        <NuxtLink to="/" class="text-gray-600 hover:text-indigo-600 transition-colors">
          Posts
        </NuxtLink>
        <NuxtLink to="/sobre" class="text-gray-600 hover:text-indigo-600 transition-colors">
          Sobre
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
