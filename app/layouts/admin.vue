<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside class="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div class="px-6 py-5 border-b border-gray-200">
        <NuxtLink to="/" class="text-sm font-bold text-indigo-600">← Ver blog</NuxtLink>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-1">
        <NuxtLink
          to="/admin"
          class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          active-class="bg-indigo-50 text-indigo-700 font-medium"
        >
          Posts
        </NuxtLink>
        <NuxtLink
          to="/admin/new"
          class="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          active-class="bg-indigo-50 text-indigo-700 font-medium"
        >
          Novo post
        </NuxtLink>
      </nav>

      <div class="px-4 py-4 border-t border-gray-200">
        <button
          @click="logout"
          class="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>

    <main class="flex-1 px-8 py-8 max-w-4xl">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

async function logout() {
  await supabase.auth.signOut()
  await router.push('/admin/login')
}
</script>
