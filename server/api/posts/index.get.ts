export default defineEventHandler(async (event) => {
  const client = useServerAdmin(event)

  const { data, error } = await client
    .from('posts')
    .select('id, title, slug, excerpt, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
