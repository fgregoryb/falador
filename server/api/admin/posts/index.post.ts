import { serverSupabaseUser } from '#supabase/server'

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

  const slug = generateSlug(title)
  const client = await useServerSupabase(event)

  const { data, error } = await (client as any)
    .from('posts')
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
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
