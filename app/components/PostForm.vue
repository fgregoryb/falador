<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
      <input
        v-model="form.title"
        type="text"
        required
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
      <input
        v-model="form.excerpt"
        type="text"
        placeholder="Aparece na listagem do blog (opcional)"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <div class="flex items-center justify-between mb-1">
        <label class="block text-sm font-medium text-gray-700">Conteúdo (Markdown)</label>
        <button
          type="button"
          @click="showPreview = !showPreview"
          class="text-xs text-indigo-600 hover:underline"
        >
          {{ showPreview ? 'Editar' : 'Preview' }}
        </button>
      </div>

      <textarea
        v-if="!showPreview"
        v-model="form.content"
        rows="16"
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div
        v-else
        class="prose prose-indigo max-w-none border border-gray-300 rounded-md px-4 py-3 min-h-64 bg-white"
        v-html="renderMarkdown(form.content || '_Nenhum conteúdo ainda._')"
      />
    </div>

    <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>

    <div class="flex gap-3">
      <button
        type="submit"
        :disabled="loading"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {{ loading ? 'Salvando...' : submitLabel }}
      </button>
      <NuxtLink
        to="/admin"
        class="px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors"
      >
        Cancelar
      </NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
interface PostData {
  title: string
  excerpt: string
  content: string
}

const props = withDefaults(defineProps<{
  initialData?: Partial<PostData>
  submitLabel?: string
  loading?: boolean
  errorMsg?: string
}>(), {
  submitLabel: 'Salvar rascunho',
  loading: false,
  errorMsg: '',
})

const emit = defineEmits<{
  submit: [data: PostData]
}>()

const showPreview = ref(false)

const form = reactive<PostData>({
  title: props.initialData?.title ?? '',
  excerpt: props.initialData?.excerpt ?? '',
  content: props.initialData?.content ?? '',
})

function handleSubmit() {
  emit('submit', { ...form })
}
</script>
