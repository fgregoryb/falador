import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { title, content, excerpt, status } = body

  if (title !== undefined && !title?.trim()) {
    throw createError({ statusCode: 400, message: 'Título é obrigatório' })
  }

  const client = await useServerSupabase(event)

  const updates: Record<string, unknown> = {}
  if (title !== undefined) updates.title = title.trim()
  if (content !== undefined) updates.content = content
  if (excerpt !== undefined) updates.excerpt = excerpt?.trim() ?? null
  if (status !== undefined) {
    updates.status = status
    updates.published_at = status === 'published' ? new Date().toISOString() : null
  }

  const { error } = await client
    .from('posts')
    .update(updates)
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
