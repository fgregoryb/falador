export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug é obrigatório' })
  }

  const client = useServerAdmin(event)

  const { data, error } = await client
    .from('posts')
    .select('id, title, slug, content, excerpt, published_at, show_cover, cover_image_url')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    throw createError({ statusCode: 404, message: 'Post não encontrado' })
  }

  return data
})
