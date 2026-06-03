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
  const { title, content, excerpt } = body

  if (!title?.trim()) {
    throw createError({ statusCode: 400, message: 'Título é obrigatório' })
  }

  const slug = slugify(title) + '-' + Date.now().toString(36)
  const client = await useServerSupabase(event)

  const { data, error } = await (client.from('posts' as any) as any)
    .insert({
      title: title.trim(),
      slug,
      content: content ?? '',
      excerpt: excerpt?.trim() ?? null,
      status: 'draft',
      author_id: user.id,
    })
    .select('id')
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: `Supabase: ${error.message}` })
  }

  return data
})
