<template>
  <div v-if="pending" style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-3);font-family:var(--font-mono);font-size:13px;">
    Carregando post…
  </div>
  <PostForm
    v-else-if="post"
    :initial-data="{ title: post.title, excerpt: post.excerpt ?? '', content: post.content }"
    submit-label="Salvar alterações"
    :loading="loading"
    @submit="updatePost"
  />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const loading = ref(false)

const { data: post, pending } = await useFetch(`/api/admin/posts/${id}`)

async function updatePost(data: { title: string; excerpt: string; content: string; publish?: boolean }) {
  loading.value = true

  const body: Record<string, unknown> = { title: data.title, excerpt: data.excerpt, content: data.content }
  if (data.publish !== undefined) body.status = data.publish ? 'published' : 'draft'

  const { error } = await useFetch(`/api/admin/posts/${id}`, { method: 'PUT', body })
  loading.value = false
  if (!error.value) await router.push('/admin')
}
</script>
