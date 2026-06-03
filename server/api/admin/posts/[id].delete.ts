import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Não autorizado' })
  }

  const id = getRouterParam(event, 'id')
  const client = await useServerSupabase(event)

  const { error } = await client
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('author_id', user.id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
