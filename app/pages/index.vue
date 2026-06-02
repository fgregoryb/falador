<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
    <p class="text-gray-500 mb-10">Pensamentos, tutoriais e anotações.</p>

    <div v-if="pending" class="text-gray-400">Carregando posts...</div>

    <div v-else-if="posts && posts.length > 0" class="space-y-6">
      <article
        v-for="post in posts"
        :key="post.slug"
        class="bg-white rounded-lg border border-gray-200 p-6 hover:border-indigo-300 transition-colors"
      >
        <time class="text-sm text-gray-400">{{ formatDate(post.published_at) }}</time>
        <h2 class="text-xl font-semibold text-gray-900 mt-1 mb-2">
          <NuxtLink :to="`/posts/${post.slug}`" class="hover:text-indigo-600 transition-colors">
            {{ post.title }}
          </NuxtLink>
        </h2>
        <p class="text-gray-600">{{ post.excerpt }}</p>
      </article>
    </div>

    <p v-else class="text-gray-400">Nenhum post publicado ainda.</p>
  </div>
</template>

<script setup lang="ts">
const { data: posts, pending } = await useFetch('/api/posts')

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>
