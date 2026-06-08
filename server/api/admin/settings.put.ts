import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Não autorizado' })

  const body = await readBody(event)
  const { site_name, site_description, contact_email, timezone, language, logo_url } = body

  if (!site_name?.trim()) throw createError({ statusCode: 400, message: 'Nome do site é obrigatório' })

  const client = useServerAdmin(event)

  // Upsert: atualiza o único registro existente
  const { error } = await client
    .from('settings')
    .update({ site_name: site_name.trim(), site_description, contact_email, timezone, language, logo_url, updated_at: new Date().toISOString() })
    .not('id', 'is', null)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
