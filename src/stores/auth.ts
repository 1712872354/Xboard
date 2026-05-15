import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AdminUser, ToastMessage } from '@/types'
import { getToken, setToken, removeToken, getUser, setUser, removeUser, clearAuth } from '@/utils/storage'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())
  const user = ref<AdminUser | null>(getUser())
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  async function login(email: string, password: string) {
    const response = await authApi.login(email, password)
    if (response.code === 0 && response.data) {
      token.value = response.data.token
      user.value = response.data.user
      setToken(response.data.token)
      setUser(response.data.user)
    }
    return response
  }

  async function logout() {
    token.value = null
    user.value = null
    clearAuth()
  }

  async function refresh() {
    const response = await authApi.getUser()
    if (response.code === 0 && response.data) {
      user.value = response.data
      setUser(response.data)
    }
    return response
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    logout,
    refresh
  }
})
