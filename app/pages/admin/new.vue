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
const router  = useRouter()

async function createPost(data: { title: string; excerpt: string; content: string; note: string; show_cover: boolean; cover_image_url: string; publish?: boolean }) {
  if (!data.title.trim()) return
  loading.value = true

  try {
    await $fetch('/api/admin/posts', {
      method: 'POST',
      body: {
        title:           data.title,
        excerpt:         data.excerpt,
        content:         data.content,
        note:            data.note,
        show_cover:      data.show_cover,
        cover_image_url: data.cover_image_url || null,
      },
    })
    await router.push('/admin')
  } catch {
    loading.value = false
  }
}
</script>
