import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Não autorizado' })

  const body = await readBody(event)
  const { name, bio, avatar_url } = body

  if (!name?.trim()) throw createError({ statusCode: 400, message: 'Nome é obrigatório' })

  const client = useServerAdmin(event)

  // Blog pessoal: só existe um perfil, atualiza o único registro
  const { error } = await client
    .from('profiles')
    .update({ name: name.trim(), bio: bio ?? '', avatar_url: avatar_url ?? null })
    .not('id', 'is', null)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
