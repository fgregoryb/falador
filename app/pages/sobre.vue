<template>
  <div>
    <div v-if="pending" class="text-gray-400">Carregando...</div>

    <div v-else-if="profile">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Sobre</h1>

      <div class="bg-white rounded-lg border border-gray-200 p-8">
        <div class="flex items-center gap-5 mb-6">
          <img
            v-if="profile.avatar_url"
            :src="profile.avatar_url"
            :alt="profile.name"
            class="w-16 h-16 rounded-full object-cover"
          />
          <div
            v-else
            class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600"
          >
            {{ profile.name.charAt(0).toUpperCase() }}
          </div>
          <h2 class="text-2xl font-semibold text-gray-900">{{ profile.name }}</h2>
        </div>

        <div class="prose prose-indigo max-w-none">
          <p class="text-gray-600 leading-relaxed">{{ profile.bio }}</p>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-400">Perfil não encontrado.</p>
  </div>
</template>

<script setup lang="ts">
const { data: profile, pending } = await useFetch('/api/profile')

useSeoMeta({
  title: () => profile.value ? `Sobre — ${profile.value.name}` : 'Sobre',
  description: () => profile.value?.bio ?? '',
})
</script>
