<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { ElForm, ElFormItem, ElInput, ElButton, ElCheckbox, ElCard } from 'element-plus'
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
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <ElCard class="border-slate-700 shadow-2xl" style="background: rgba(30, 41, 59, 0.8); backdrop-filter: blur(10px);">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-indigo-500/20 mb-4">
            <span class="text-3xl font-bold text-indigo-400">X</span>
          </div>
          <h1 class="text-2xl font-bold text-white">Xboard</h1>
          <p class="text-slate-400 mt-2">代理协议管理面板</p>
        </div>

        <ElForm @submit.prevent="handleLogin" class="space-y-6">
          <ElFormItem>
            <label class="block text-sm font-medium text-slate-300 mb-2">邮箱</label>
            <ElInput
              v-model="email"
              type="email"
              placeholder="请输入邮箱"
              prefix-icon="Mail"
              class="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
            />
          </ElFormItem>

          <ElFormItem>
            <label class="block text-sm font-medium text-slate-300 mb-2">密码</label>
            <ElInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              prefix-icon="Lock"
              :suffix-icon="showPassword ? 'EyeOff' : 'Eye'"
              class="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              @click-suffix="showPassword = !showPassword"
            />
          </ElFormItem>

          <div class="flex items-center justify-between">
            <ElCheckbox v-model="remember" class="text-slate-400">
              <span class="text-sm text-slate-400">记住我</span>
            </ElCheckbox>
            <a href="#" class="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              忘记密码？
            </a>
          </div>

          <ElButton
            type="primary"
            native-type="submit"
            :loading="loading"
            class="w-full h-11 text-base font-medium"
          >
            <LogIn class="w-5 h-5 mr-2" />
            {{ loading ? '登录中...' : '登 录' }}
          </ElButton>
        </ElForm>

        <div class="mt-6 text-center">
          <p class="text-slate-400 text-sm">
            还没有账号？
            <a href="#" class="text-indigo-400 hover:text-indigo-300 transition-colors">
              联系管理员
            </a>
          </p>
        </div>
      </ElCard>

      <p class="text-center text-slate-500 text-sm mt-6">
        © 2024 Xboard. All rights reserved.
      </p>
    </div>
  </div>
</template>
