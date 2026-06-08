import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const id   = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { title, content, excerpt, status, note, show_cover } = body

  if (title !== undefined && !title?.trim()) {
    throw createError({ statusCode: 400, message: 'Título é obrigatório' })
  }

  const client  = useServerAdmin(event)
  const updates: Record<string, unknown> = {}

  if (title      !== undefined) updates.title      = title.trim()
  if (content    !== undefined) updates.content    = content
  if (excerpt    !== undefined) updates.excerpt    = excerpt?.trim() ?? null
  if (note       !== undefined) updates.note       = note ?? null
  if (show_cover !== undefined) updates.show_cover = show_cover
  if (status     !== undefined) {
    updates.status       = status
    updates.published_at = status === 'published' ? new Date().toISOString() : null
  }

  const { error } = await client
    .from('posts')
    .update(updates)
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
