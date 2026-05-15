<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-vue-next'

const appStore = useAppStore()

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const colorMap = {
  success: 'text-green-500 bg-green-500/10 border-green-500/30',
  error: 'text-red-500 bg-red-500/10 border-red-500/30',
  warning: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  info: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
}
</script>

<template>
  <Transition name="toast">
    <div
      v-if="appStore.toast"
      class="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px]"
      :class="colorMap[appStore.toast.type]"
    >
      <component :is="iconMap[appStore.toast.type]" class="w-5 h-5 flex-shrink-0" />
      <span class="text-sm font-medium">{{ appStore.toast.message }}</span>
      <button
        class="ml-auto text-gray-400 hover:text-white transition-colors"
        @click="appStore.hideToast"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
