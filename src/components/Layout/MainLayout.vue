<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Toast from '../Common/Toast.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<template>
  <div class="min-h-screen bg-dark">
    <Sidebar />
    <Header />
    
    <main
      class="pt-16 transition-all duration-300"
      :class="appStore.sidebarCollapsed ? 'ml-16' : 'ml-64'"
    >
      <div class="p-6">
        <router-view />
      </div>
    </main>
    
    <Toast />
    
    <div
      v-if="appStore.loading"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template>
