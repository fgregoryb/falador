<template>
  <div style="display:flex;flex-direction:column;height:100%;">
    <!-- Topbar -->
    <header style="height:64px;flex:none;border-bottom:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:space-between;padding:0 26px;">
      <div>
        <div style="font-size:16px;font-weight:600;font-family:var(--font-display);letter-spacing:-0.01em;">
          {{ submitLabel === 'Salvar alterações' ? 'Editar post' : 'Novo post' }}
        </div>
        <div style="font-size:12.5px;margin-top:1px;display:inline-flex;align-items:center;gap:6px;">
          <span :style="{ width:'7px', height:'7px', borderRadius:'99px', display:'block', background: saveState === 'saving' ? '#c98a23' : '#2a9d5c' }" />
          <span style="color:var(--text-3);">{{ saveState === 'saving' ? 'Salvando…' : 'Salvo automaticamente' }}</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="display:inline-flex;align-items:center;gap:6px;color:var(--text-3);font-size:12.5px;font-family:var(--font-mono);margin-right:4px;">
          <FIcon name="wordcount" :size="14" /> {{ wordCount }} palavras
        </span>
        <button class="btn btn-ghost btn-sm" :disabled="loading" @click="$emit('submit', { ...form, publish: false })">
          <FIcon name="save" :size="15" /> Rascunho
        </button>
        <button class="btn btn-primary btn-sm" :disabled="loading" @click="$emit('submit', { ...form, publish: true })">
          {{ loading ? 'Salvando…' : submitLabel }}
        </button>
      </div>
    </header>

    <!-- Meta strip -->
    <div style="padding:20px 26px 16px;border-bottom:1px solid var(--border);background:var(--surface);">
      <p v-if="titleError" style="color:#e5484d;font-size:12.5px;margin:0 0 6px;">{{ titleError }}</p>
      <input v-model="form.title" placeholder="Título do post…"
        class="serif" style="width:100%;border:none;outline:none;background:none;font-size:30px;font-weight:500;letter-spacing:-0.02em;color:var(--text);margin-bottom:8px;" />
      <input v-model="form.excerpt" placeholder="Escreva um resumo curto que aparece na home…"
        style="width:100%;border:none;outline:none;background:none;font-size:15px;color:var(--text-2);font-family:var(--font-ui);margin-bottom:4px;" />
      <div style="font-size:12px;color:var(--text-3);font-family:var(--font-mono);">
        {{ form.excerpt.length }}/160 caracteres
      </div>
    </div>

    <!-- Split pane -->
    <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;min-height:0;">
      <!-- Editor -->
      <div style="display:flex;flex-direction:column;border-right:1px solid var(--border);min-height:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-bottom:1px solid var(--border);background:var(--surface);">
          <div style="display:flex;gap:2px;align-items:center;">
            <button v-for="t in tools" :key="t[0]" class="icon-btn" :title="t[1]" @click="insert(t[2], t[3], t[4])">
              <FIcon :name="t[0]" :size="16" />
            </button>
            <div style="width:1px;height:20px;background:var(--border);margin:0 6px;" />
            <button class="btn btn-subtle btn-sm" style="font-family:var(--font-mono);font-size:12px;" @click="insertCodeBlock">
              &lt;/&gt; bloco
            </button>
          </div>
          <span class="eyebrow">Markdown</span>
        </div>
        <textarea ref="taRef" v-model="form.content" spellcheck="false"
          style="flex:1;border:none;outline:none;resize:none;padding:24px 26px;background:var(--surface);color:var(--text);font-family:var(--font-mono);font-size:14px;line-height:1.75;min-height:0;" />
      </div>

      <!-- Preview -->
      <div style="display:flex;flex-direction:column;min-height:0;background:var(--bg);">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-bottom:1px solid var(--border);background:var(--surface);">
          <span style="display:inline-flex;align-items:center;gap:7px;color:var(--text-2);font-size:13px;font-weight:600;">
            <FIcon name="eye" :size="15" /> Preview ao vivo
          </span>
          <span class="eyebrow">como vai aparecer</span>
        </div>
        <div style="flex:1;overflow-y:auto;padding:32px 40px;min-height:0;">
          <article style="max-width:620px;margin:0 auto;">
            <h1 v-if="form.title" class="serif" style="font-size:36px;font-weight:500;letter-spacing:-0.025em;line-height:1.1;margin:0 0 14px;">{{ form.title }}</h1>
            <p v-if="form.excerpt" style="font-size:17px;color:var(--text-2);line-height:1.55;margin:0 0 24px;">{{ form.excerpt }}</p>
            <div class="prose" style="font-size:17px;" v-html="renderMarkdown(form.content)" />
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PostData {
  title: string
  excerpt: string
  content: string
  publish?: boolean
}

const props = withDefaults(defineProps<{
  initialData?: Partial<PostData>
  submitLabel?: string
  loading?: boolean
}>(), {
  submitLabel: 'Publicar',
  loading: false,
})

defineEmits<{ submit: [data: PostData] }>()

const taRef = ref<HTMLTextAreaElement | null>(null)
const saveState = ref<'saved' | 'saving'>('saved')
let saveTimer: ReturnType<typeof setTimeout>

const form = reactive<PostData>({
  title: props.initialData?.title ?? '',
  excerpt: props.initialData?.excerpt ?? '',
  content: props.initialData?.content ?? '# Comece a escrever\n\nUm parágrafo de abertura.\n\n## Um subtítulo\n\n- item de lista\n',
})

watch(() => [form.title, form.excerpt, form.content], () => {
  saveState.value = 'saving'
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => { saveState.value = 'saved' }, 900)
})

const wordCount = computed(() => form.content.trim() ? form.content.trim().split(/\s+/).length : 0)

const titleError = computed(() => {
  if (!form.title.trim()) return 'O título é obrigatório.'
  if (form.title.length > 100) return 'Máximo 100 caracteres.'
  return ''
})

const tools: [string, string, string, string, string][] = [
  ['bold', 'Negrito', '**', '**', 'texto'],
  ['italic', 'Itálico', '*', '*', 'texto'],
  ['heading', 'Título', '## ', '', 'Subtítulo'],
  ['link', 'Link', '[', '](url)', 'texto'],
  ['code', 'Código inline', '`', '`', 'code'],
  ['list', 'Lista', '- ', '', 'item'],
  ['quote', 'Citação', '> ', '', 'citação'],
]

function insert(pre: string, post: string, placeholder: string) {
  const ta = taRef.value
  if (!ta) return
  const s = ta.selectionStart, e = ta.selectionEnd
  const sel = form.content.slice(s, e) || placeholder
  form.content = form.content.slice(0, s) + pre + sel + post + form.content.slice(e)
  nextTick(() => { ta.focus(); ta.selectionStart = s + pre.length; ta.selectionEnd = s + pre.length + sel.length })
}

function insertCodeBlock() {
  insert('\n```js\n', '\n```\n', 'console.log()')
}
</script>
