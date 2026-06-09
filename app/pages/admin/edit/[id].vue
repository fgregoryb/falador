<template>
  <div v-if="pending" style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-3);font-family:var(--font-mono);font-size:13px;">
    Carregando post…
  </div>
  <PostForm
    v-else-if="post"
    :initial-data="{
      title:           post.title,
      excerpt:         post.excerpt ?? '',
      content:         post.content,
      note:            (post as any).note            ?? '',
      show_cover:      (post as any).show_cover      ?? true,
      cover_image_url: (post as any).cover_image_url ?? '',
    }"
    submit-label="Salvar alterações"
    :loading="loading"
    @submit="updatePost"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const route   = useRoute()
const router  = useRouter()
const id      = route.params.id as string
const loading = ref(false)

const { data: post, pending } = await useFetch(`/api/admin/posts/${id}`)

async function updatePost(data: { title: string; excerpt: string; content: string; note: string; show_cover: boolean; cover_image_url: string; publish?: boolean }) {
  loading.value = true

  const body: Record<string, unknown> = {
    title:           data.title,
    excerpt:         data.excerpt,
    content:         data.content,
    note:            data.note,
    show_cover:      data.show_cover,
    cover_image_url: data.cover_image_url || null,
  }
  if (data.publish !== undefined) body.status = data.publish ? 'published' : 'draft'

  try {
    await $fetch(`/api/admin/posts/${id}`, { method: 'PUT', body })
    await router.push('/admin')
  } catch {
    loading.value = false
  }
}
</script>
