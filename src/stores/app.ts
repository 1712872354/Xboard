import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastMessage } from '@/types'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const loading = ref(false)
  const toast = ref<ToastMessage | null>(null)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function showToast(type: ToastMessage['type'], message: string) {
    toast.value = { type, message }
    setTimeout(() => {
      toast.value = null
    }, 3000)
  }

  function hideToast() {
    toast.value = null
  }

  return {
    sidebarCollapsed,
    loading,
    toast,
    toggleSidebar,
    setLoading,
    showToast,
    hideToast
  }
})
