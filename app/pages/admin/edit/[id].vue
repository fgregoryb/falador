<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Editar post</h1>

    <div v-if="pending" class="text-gray-400">Carregando post...</div>

    <PostForm
      v-else-if="post"
      :initial-data="post"
      submit-label="Salvar alterações"
      :loading="loading"
      :error-msg="errorMsg"
      @submit="updatePost"
    />

    <p v-else class="text-gray-400">Post não encontrado.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const { data: post, pending } = await useFetch(`/api/admin/posts/${id}`)

const loading = ref(false)
const errorMsg = ref('')

async function updatePost(data: { title: string; excerpt: string; content: string }) {
  loading.value = true
  errorMsg.value = ''

  const { error } = await useFetch(`/api/admin/posts/${id}`, {
    method: 'PUT',
    body: data,
  })

  if (error.value) {
    errorMsg.value = error.value.data?.message ?? 'Erro ao salvar.'
    loading.value = false
    return
  }

  await router.push('/admin')
}
</script>
