<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Posts</h1>
      <NuxtLink
        to="/admin/new"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        Novo post
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-gray-400">Carregando...</div>

    <div v-else-if="posts && posts.length > 0" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Título</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
            <th class="text-left px-4 py-3 text-gray-600 font-medium">Data</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-900 font-medium">{{ post.title }}</td>
            <td class="px-4 py-3">
              <span
                :class="post.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'"
                class="px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {{ post.status === 'published' ? 'Publicado' : 'Rascunho' }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500">{{ formatDate(post.created_at) }}</td>
            <td class="px-4 py-3 text-right">
              <NuxtLink
                :to="`/admin/edit/${post.id}`"
                class="text-indigo-600 hover:underline"
              >
                Editar
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-gray-400">Nenhum post ainda. Crie o primeiro!</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { data: posts, pending } = await useFetch('/api/admin/posts')

function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('pt-BR')
}
</script>
