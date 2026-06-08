import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Não autorizado' })

  const client = useServerAdmin(event)
  const { data, error } = await client
    .from('settings')
    .select('*')
    .single()

  if (error) {
    // Retorna defaults se tabela ainda não existir
    return {
      site_name:        'Verbose',
      site_description: '',
      contact_email:    '',
      timezone:         'America/Sao_Paulo',
      language:         'pt-BR',
      logo_url:         '',
    }
  }

  return data
})
