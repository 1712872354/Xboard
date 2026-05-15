<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { formatBytes, formatTimestamp } from '@/utils/format'
import { Plus, Search, Filter, Edit, Eye, Trash2, Ban, RefreshCw, Download, MoreVertical } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const searchKeyword = ref('')
const statusFilter = ref('all')
const showFilters = ref(false)
const selectedUsers = ref<number[]>([])

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '正常' },
  { value: 'banned', label: '封禁' }
]

async function fetchUsers() {
  const params: Record<string, any> = {
    page: userStore.pagination.page,
    page_size: userStore.pagination.page_size
  }
  
  if (searchKeyword.value) {
    params.keyword = searchKeyword.value
  }
  
  if (statusFilter.value !== 'all') {
    params.status = statusFilter.value === 'active' ? 0 : 1
  }
  
  await userStore.fetchList(params)
}

function handlePageChange(page: number) {
  userStore.pagination.page = page
  fetchUsers()
}

function handleView(id: number) {
  router.push(`/admin/user/detail/${id}`)
}

function handleEdit(id: number) {
  router.push(`/admin/user/detail/${id}`)
}

async function handleDelete(id: number) {
  if (confirm('确定要删除该用户吗？')) {
    const response = await userStore.del(id)
    if (response.code === 0) {
      appStore.showToast('success', '删除成功')
    }
  }
}

async function handleBan(id: number, banned: boolean) {
  const response = await userStore.ban(id, banned)
  if (response.code === 0) {
    appStore.showToast('success', banned ? '已封禁' : '已解封')
    fetchUsers()
  }
}

async function handleResetTraffic(id: number) {
  const response = await userStore.resetTraffic(id)
  if (response.code === 0) {
    appStore.showToast('success', '流量已重置')
    fetchUsers()
  }
}

function getStatusText(banned: boolean): string {
  return banned ? '封禁' : '正常'
}

function getStatusClass(banned: boolean): string {
  return banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
}

function toggleSelect(id: number) {
  const index = selectedUsers.value.indexOf(id)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(id)
  }
}

function selectAll() {
  if (selectedUsers.value.length === userStore.list.length) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = userStore.list.map(u => u.id)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">用户管理</h1>
        <p class="text-gray-400 mt-1">管理系统用户</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          @click="showFilters = !showFilters"
        >
          <Filter class="w-4 h-4" />
          筛选
        </button>
        <button class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
          <Download class="w-4 h-4" />
          导出
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          @click="router.push('/admin/user/detail/0')"
        >
          <Plus class="w-4 h-4" />
          创建用户
        </button>
      </div>
    </div>

    <div v-if="showFilters" class="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 max-w-md">
          <label class="block text-sm text-gray-400 mb-2">搜索关键词</label>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索邮箱..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-2">状态</label>
          <select
            v-model="statusFilter"
            class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            class="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            @click="fetchUsers"
          >
            应用筛选
          </button>
        </div>
      </div>
    </div>

    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="p-4 border-b border-gray-700">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="selectedUsers.length === userStore.list.length && userStore.list.length > 0"
                class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                @click="selectAll"
              />
              <span class="text-gray-400 text-sm">全选</span>
            </label>
            <span v-if="selectedUsers.length > 0" class="text-gray-400 text-sm">
              已选择 {{ selectedUsers.length }} 项
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              title="刷新"
              @click="fetchUsers"
            >
              <RefreshCw class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-700/50">
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <input
                  type="checkbox"
                  :checked="selectedUsers.length === userStore.list.length && userStore.list.length > 0"
                  class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                  @click="selectAll"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">邮箱</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">套餐</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">流量使用</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">余额</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">创建时间</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="user in userStore.list" :key="user.id" class="hover:bg-gray-700/30 transition-colors">
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="selectedUsers.includes(user.id)"
                  class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                  @click="toggleSelect(user.id)"
                />
              </td>
              <td class="px-4 py-4">
                <span class="text-white font-medium">{{ user.email }}</span>
              </td>
              <td class="px-4 py-4">
                <span class="text-gray-400 text-sm">套餐 {{ user.plan_id || '-' }}</span>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <span class="text-gray-400 text-sm">
                    {{ formatBytes(user.u + user.d) }} / {{ formatBytes(user.transfer_enable) }}
                  </span>
                </div>
                <div class="mt-1 h-1.5 w-32 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full"
                    :style="{ width: `${Math.min((user.u + user.d) / user.transfer_enable * 100, 100)}%` }"
                  ></div>
                </div>
              </td>
              <td class="px-4 py-4">
                <span class="text-green-400">¥{{ user.balance.toFixed(2) }}</span>
              </td>
              <td class="px-4 py-4">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="getStatusClass(user.banned)">
                  {{ getStatusText(user.banned) }}
                </span>
              </td>
              <td class="px-4 py-4">
                <span class="text-gray-400 text-sm">{{ formatTimestamp(user.created_at) }}</span>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <button
                    class="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                    title="查看详情"
                    @click="handleView(user.id)"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                    title="编辑"
                    @click="handleEdit(user.id)"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-gray-400 hover:bg-gray-700 hover:text-red-400 rounded-lg transition-colors"
                    title="重置流量"
                    @click="handleResetTraffic(user.id)"
                  >
                    <RefreshCw class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-gray-400 hover:bg-gray-700 hover:text-yellow-400 rounded-lg transition-colors"
                    title="封禁/解封"
                    @click="handleBan(user.id, !user.banned)"
                  >
                    <Ban class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-gray-400 hover:bg-gray-700 hover:text-red-400 rounded-lg transition-colors"
                    title="删除"
                    @click="handleDelete(user.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="userStore.list.length === 0" class="py-12 text-center">
          <p class="text-gray-400">暂无数据</p>
        </div>
      </div>

      <div v-if="userStore.pagination.total > 0" class="p-4 border-t border-gray-700">
        <div class="flex items-center justify-between">
          <span class="text-gray-400 text-sm">
            显示 {{ (userStore.pagination.page - 1) * userStore.pagination.page_size + 1 }} - 
            {{ Math.min(userStore.pagination.page * userStore.pagination.page_size, userStore.pagination.total) }} 
            条，共 {{ userStore.pagination.total }} 条
          </span>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="userStore.pagination.page === 1"
              @click="handlePageChange(userStore.pagination.page - 1)"
            >
              上一页
            </button>
            <button
              class="px-3 py-1 text-sm bg-primary text-white rounded-lg"
            >
              {{ userStore.pagination.page }}
            </button>
            <button
              class="px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="userStore.pagination.page >= Math.ceil(userStore.pagination.total / userStore.pagination.page_size)"
              @click="handlePageChange(userStore.pagination.page + 1)"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
