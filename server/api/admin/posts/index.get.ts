import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const client = useServerAdmin(event)

  const { data, error } = await client
    .from('posts')
    .select('id, title, slug, status, published_at, created_at')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
