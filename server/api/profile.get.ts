export default defineEventHandler(async (event) => {
  const client = await useServerSupabase(event)

  const { data, error } = await client
    .from('profiles')
    .select('name, bio, avatar_url')
    .single()

  if (error) {
    throw createError({ statusCode: 404, message: 'Perfil não encontrado' })
  }

  return data
})
