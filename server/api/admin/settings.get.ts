import { serverSupabaseUser } from '#supabase/server'

const DEFAULTS = {
  site_name:        'Verbose',
  site_description: '',
  contact_email:    '',
  timezone:         'America/Sao_Paulo',
  language:         'pt-BR',
  logo_url:         '',
  github_url:       '',
  linkedin_url:     '',
  facebook_url:     '',
  instagram_url:    '',
  twitter_url:      '',
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Não autorizado' })

  const client = useServerAdmin(event)
  const { data, error } = await client.from('settings').select('*').single()

  if (error) return DEFAULTS
  return { ...DEFAULTS, ...data }
})
