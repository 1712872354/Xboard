<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    appStore.showToast('error', '请输入邮箱和密码')
    return
  }

  loading.value = true
  const response = await authStore.login(email.value, password.value)
  loading.value = false

  if (response.code === 0) {
    appStore.showToast('success', '登录成功')
    router.push('/admin/dashboard')
  } else {
    appStore.showToast('error', response.message || '登录失败')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/20 mb-4">
              <span class="text-3xl font-bold text-primary">X</span>
            </div>
            <h1 class="text-2xl font-bold text-white">Xboard</h1>
            <p class="text-gray-400 mt-2">代理协议管理面板</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
              <div class="relative">
                <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  v-model="email"
                  type="email"
                  placeholder="请输入邮箱"
                  class="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">密码</label>
              <div class="relative">
                <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  class="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="remember"
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                />
                <span class="text-sm text-gray-400">记住我</span>
              </label>
              <a href="#" class="text-sm text-primary hover:text-primary/80 transition-colors">
                忘记密码？
              </a>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn class="w-5 h-5" />
              {{ loading ? '登录中...' : '登 录' }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-gray-400 text-sm">
              还没有账号？
              <a href="#" class="text-primary hover:text-primary/80 transition-colors">
                联系管理员
              </a>
            </p>
          </div>
        </div>
      </div>

      <p class="text-center text-gray-500 text-sm mt-6">
        © 2024 Xboard. All rights reserved.
      </p>
    </div>
  </div>
</template>
