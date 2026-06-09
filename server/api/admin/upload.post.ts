import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Não autorizado' })

  const form = await readMultipartFormData(event)
  if (!form || form.length === 0)
    throw createError({ statusCode: 400, message: 'Nenhum arquivo enviado.' })

  const filePart = form.find(p => p.name === 'file')
  if (!filePart?.data)
    throw createError({ statusCode: 400, message: 'Campo "file" ausente.' })

  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  const mime    = filePart.type ?? ''
  if (!allowed.includes(mime))
    throw createError({ statusCode: 400, message: 'Use JPG, PNG ou WebP.' })

  if (filePart.data.length > 2 * 1024 * 1024)
    throw createError({ statusCode: 400, message: 'Arquivo muito grande. Máximo 2 MB.' })

  const bucket  = form.find(p => p.name === 'bucket')?.data?.toString() ?? 'avatars'
  const ext     = mime.split('/')[1].replace('jpeg', 'jpg')
  const path    = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const client  = useServerAdmin(event)
  const { error } = await client.storage
    .from(bucket)
    .upload(path, filePart.data, { contentType: mime, upsert: true })

  if (error) throw createError({ statusCode: 500, message: error.message })

  const { data } = client.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl }
})
