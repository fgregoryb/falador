export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug é obrigatório' })
  }

  const client = await useServerSupabase(event)

  const { data, error } = await client
    .from('posts')
    .select('id, title, slug, content, excerpt, published_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    throw createError({ statusCode: 404, message: 'Post não encontrado' })
  }

  return data
})
