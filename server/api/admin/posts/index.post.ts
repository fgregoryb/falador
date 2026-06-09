import { serverSupabaseUser } from '#supabase/server'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const body = await readBody(event)
  const { title, content, excerpt, note, show_cover, cover_image_url } = body

  if (!title?.trim()) {
    throw createError({ statusCode: 400, message: 'Título é obrigatório' })
  }

  const slug   = slugify(title) + '-' + Date.now().toString(36)
  const client = useServerAdmin(event)

  const { data, error } = await client
    .from('posts')
    .insert({
      title:      title.trim(),
      slug,
      content:    content    ?? '',
      excerpt:    excerpt?.trim() ?? null,
      note:            note            ?? null,
      show_cover:      show_cover      ?? true,
      cover_image_url: cover_image_url ?? null,
      status:     'draft',
      author_id:  user.id,
    })
    .select('id')
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: `Supabase: ${error.message}` })
  }

  return data
})
