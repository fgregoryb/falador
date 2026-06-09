export default defineEventHandler(async (event) => {
  const client = useServerAdmin(event)
  const { data } = await client
    .from('settings')
    .select('location, timezone, language, site_name, site_description, github_url, linkedin_url, twitter_url, instagram_url, facebook_url')
    .single()

  return data ?? {
    timezone: 'America/Sao_Paulo', language: 'pt-BR',
    site_name: 'Verbose', site_description: '',
    github_url: '', linkedin_url: '', twitter_url: '', instagram_url: '', facebook_url: '',
  }
})
