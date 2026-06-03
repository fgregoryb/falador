import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'

export const useServerSupabase = (event: H3Event) => serverSupabaseClient(event)

export const useServerAdmin = (event: H3Event) => serverSupabaseServiceRole(event)
