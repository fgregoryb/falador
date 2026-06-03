<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Novo post</h1>

    <PostForm
      :loading="loading"
      :error-msg="errorMsg"
      @submit="createPost"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const loading = ref(false)
const errorMsg = ref('')
const router = useRouter()

async function createPost(data: { title: string; excerpt: string; content: string }) {
  loading.value = true
  errorMsg.value = ''

  const { error } = await useFetch('/api/admin/posts', {
    method: 'POST',
    body: data,
  })

  if (error.value) {
    errorMsg.value = error.value.data?.message ?? 'Erro ao salvar o post.'
    loading.value = false
    return
  }

  await router.push('/admin')
}
</script>
