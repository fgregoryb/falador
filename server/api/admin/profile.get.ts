import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Não autorizado' })

  const client = useServerAdmin(event)
  const { data, error } = await client
    .from('profiles')
    .select('name, bio, avatar_url')
    .single()

  if (error) throw createError({ statusCode: 404, message: 'Perfil não encontrado' })

  return data
})
