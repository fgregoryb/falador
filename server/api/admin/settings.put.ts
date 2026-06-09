import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Não autorizado' })

  const {
    site_name, site_description, contact_email,
    timezone, language, logo_url,
    github_url, linkedin_url, facebook_url, instagram_url, twitter_url,
  } = await readBody(event)

  if (!site_name?.trim())
    throw createError({ statusCode: 400, message: 'Nome do site é obrigatório' })

  const client = useServerAdmin(event)
  const { error } = await client
    .from('settings')
    .update({
      site_name: site_name.trim(), site_description, contact_email,
      timezone, language, logo_url,
      github_url, linkedin_url, facebook_url, instagram_url, twitter_url,
      updated_at: new Date().toISOString(),
    })
    .not('id', 'is', null)

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { success: true }
})
