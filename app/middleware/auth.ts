export default defineNuxtRouteMiddleware(async () => {
  const user = await useSupabaseUser()

  if (!user.value) {
    return navigateTo('/admin/login')
  }
})
