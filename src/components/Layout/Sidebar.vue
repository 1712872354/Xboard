<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const activeMenu = computed(() => router.currentRoute.value.path)

const menuItems = [
  { path: '/admin/dashboard', name: '仪表板', icon: 'LayoutDashboard' },
  { path: '/admin/user/list', name: '用户管理', icon: 'Users' },
  { path: '/admin/plan/list', name: '套餐管理', icon: 'Package' },
  {
    path: '/admin/server/manage',
    name: '节点管理',
    icon: 'Server',
    children: [
      { path: '/admin/server/manage', name: '节点列表' },
      { path: '/admin/server/group', name: '分组管理' },
      { path: '/admin/server/route', name: '路由规则' },
      { path: '/admin/server/machine', name: '机器管理' }
    ]
  },
  { path: '/admin/order/list', name: '订单管理', icon: 'ShoppingCart' },
  { path: '/admin/payment', name: '支付管理', icon: 'Wallet' },
  { path: '/admin/coupon', name: '优惠券', icon: 'Ticket' },
  { path: '/admin/gift-card', name: '礼品卡', icon: 'Gift' },
  { path: '/admin/ticket/list', name: '工单管理', icon: 'MessageSquare' },
  { path: '/admin/notice', name: '公告管理', icon: 'Bell' },
  { path: '/admin/knowledge', name: '知识库', icon: 'BookOpen' },
  { path: '/admin/stats', name: '统计报表', icon: 'BarChart3' },
  { path: '/admin/config', name: '系统配置', icon: 'Settings' },
  { path: '/admin/mail/template', name: '邮件模板', icon: 'Mail' },
  { path: '/admin/plugin', name: '插件管理', icon: 'Puzzle' },
  { path: '/admin/system', name: '系统状态', icon: 'Activity' }
]

const expandedMenus = ref<string[]>([])

function toggleMenu(path: string) {
  const index = expandedMenus.value.indexOf(path)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  } else {
    expandedMenus.value.push(path)
  }
}

function isExpanded(path: string): boolean {
  return expandedMenus.value.includes(path)
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-screen bg-dark border-r border-gray-700 transition-all duration-300 z-50"
    :class="appStore.sidebarCollapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center h-16 px-4 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span class="text-white font-bold text-sm">X</span>
          </div>
          <span
            v-if="!appStore.sidebarCollapsed"
            class="text-white font-semibold text-lg"
          >
            Xboard
          </span>
        </div>
      </div>

      <nav class="flex-1 py-4 overflow-y-auto">
        <ul class="space-y-1 px-2">
          <li v-for="item in menuItems" :key="item.path">
            <template v-if="item.children">
              <button
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                @click="toggleMenu(item.path)"
              >
                <component :is="getIcon(item.icon)" class="w-5 h-5" />
                <span v-if="!appStore.sidebarCollapsed" class="flex-1 text-left">
                  {{ item.name }}
                </span>
                <svg
                  v-if="!appStore.sidebarCollapsed"
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': isExpanded(item.path) }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ul
                v-if="isExpanded(item.path)"
                class="mt-1 space-y-1 pl-6"
              >
                <li v-for="child in item.children" :key="child.path">
                  <router-link
                    :to="child.path"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    :class="{ 'bg-primary/20 text-primary': activeMenu === child.path }"
                  >
                    <span>{{ child.name }}</span>
                  </router-link>
                </li>
              </ul>
            </template>
            <template v-else>
              <router-link
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                :class="{ 'bg-primary/20 text-primary': activeMenu === item.path }"
              >
                <component :is="getIcon(item.icon)" class="w-5 h-5" />
                <span v-if="!appStore.sidebarCollapsed">{{ item.name }}</span>
              </router-link>
            </template>
          </li>
        </ul>
      </nav>

      <div class="p-2 border-t border-gray-700">
        <button
          v-if="!appStore.sidebarCollapsed"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          @click="logout"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>退出登录</span>
        </button>
        <button
          v-else
          class="w-full p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          title="退出登录"
          @click="logout"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import {
  LayoutDashboard,
  Users,
  Package,
  Server,
  ShoppingCart,
  Wallet,
  Ticket,
  Gift,
  MessageSquare,
  Bell,
  BookOpen,
  BarChart3,
  Settings,
  Mail,
  Puzzle,
  Activity
} from 'lucide-vue-next'

export function getIcon(iconName: string) {
  const icons: Record<string, any> = {
    LayoutDashboard,
    Users,
    Package,
    Server,
    ShoppingCart,
    Wallet,
    Ticket,
    Gift,
    MessageSquare,
    Bell,
    BookOpen,
    BarChart3,
    Settings,
    Mail,
    Puzzle,
    Activity
  }
  return icons[iconName] || LayoutDashboard
}
</script>
