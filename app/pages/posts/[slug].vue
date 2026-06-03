<template>
  <div>
    <div v-if="pending" class="text-gray-400">Carregando post...</div>

    <article v-else-if="post">
      <NuxtLink to="/" class="text-sm text-indigo-600 hover:underline mb-8 inline-block">
        ← Voltar ao blog
      </NuxtLink>

      <time class="block text-sm text-gray-400 mt-4">{{ formatDate(post.published_at) }}</time>
      <h1 class="text-3xl font-bold text-gray-900 mt-2 mb-8">{{ post.title }}</h1>

      <div
        class="prose prose-indigo max-w-none"
        v-html="renderMarkdown(post.content)"
      />
    </article>

    <p v-else class="text-gray-400">Post não encontrado.</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: post, pending } = await useFetch(`/api/posts/slug/${route.params.slug}`)

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>
