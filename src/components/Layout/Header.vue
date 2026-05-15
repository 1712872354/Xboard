<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { Bell, Search, Menu, User } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const searchQuery = ref('')

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="fixed top-0 right-0 h-16 bg-dark border-b border-gray-700 flex items-center justify-between px-6 z-40"
    :class="appStore.sidebarCollapsed ? 'left-16' : 'left-64'"
  >
    <div class="flex items-center gap-4">
      <button
        class="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        @click="appStore.toggleSidebar"
      >
        <Menu class="w-5 h-5" />
      </button>
      
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索..."
          class="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
        />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button class="relative p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
        <Bell class="w-5 h-5" />
        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      <div class="flex items-center gap-3 pl-4 border-l border-gray-700">
        <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <User class="w-4 h-4 text-primary" />
        </div>
        <div class="hidden md:block">
          <p class="text-white text-sm font-medium">{{ authStore.user?.email }}</p>
          <p class="text-gray-400 text-xs">管理员</p>
        </div>
        <button
          class="p-1 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          title="退出登录"
          @click="logout"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
