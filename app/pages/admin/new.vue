<template>
  <PostForm
    submit-label="Publicar"
    :loading="loading"
    @submit="createPost"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const loading = ref(false)
const router = useRouter()

async function createPost(data: { title: string; excerpt: string; content: string; publish?: boolean }) {
  if (!data.title.trim()) return
  loading.value = true

  const { error } = await useFetch('/api/admin/posts', {
    method: 'POST',
    body: { title: data.title, excerpt: data.excerpt, content: data.content },
  })

  loading.value = false
  if (!error.value) await router.push('/admin')
}
</script>
