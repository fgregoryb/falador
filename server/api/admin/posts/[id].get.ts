import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const id     = getRouterParam(event, 'id')
  const client = useServerAdmin(event)

  const { data, error } = await client
    .from('posts')
    .select('id, title, slug, content, excerpt, status, published_at, note, show_cover, cover_image_url')
    .eq('id', id)
    .single()

  if (error) {
    throw createError({ statusCode: 404, message: 'Post não encontrado' })
  }

  return data
})
