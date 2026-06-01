<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
    <p class="text-gray-500 mb-10">Pensamentos, tutoriais e anotações.</p>

    <div class="space-y-6">
      <article
        v-for="post in posts"
        :key="post.slug"
        class="bg-white rounded-lg border border-gray-200 p-6 hover:border-indigo-300 transition-colors"
      >
        <time class="text-sm text-gray-400">{{ post.date }}</time>
        <h2 class="text-xl font-semibold text-gray-900 mt-1 mb-2">
          <NuxtLink :to="`/posts/${post.slug}`" class="hover:text-indigo-600 transition-colors">
            {{ post.title }}
          </NuxtLink>
        </h2>
        <p class="text-gray-600">{{ post.excerpt }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const posts = [
  {
    slug: 'hello-world',
    title: 'Olá, mundo!',
    excerpt: 'Este é o primeiro post do blog. Em breve virão conteúdos de verdade.',
    date: '1 jun 2026',
  },
  {
    slug: 'aprendendo-nuxt',
    title: 'Aprendendo Nuxt 3 do zero',
    excerpt: 'Nuxt é um framework incrível para construir aplicações Vue com SSR.',
    date: '1 jun 2026',
  },
]
</script>
