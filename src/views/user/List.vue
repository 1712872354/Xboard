<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { ElTable, ElTableColumn, ElPagination, ElButton, ElInput, ElSelect, ElCheckbox, ElCard, ElTag } from 'element-plus'
import { formatBytes, formatTimestamp } from '@/utils/format'
import { Plus, Search, Filter, Edit, Eye, Trash2, Ban, RefreshCw, Download, MoreVertical } from 'lucide-vue-next'
import type { User } from '@/types'

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

function getStatusType(banned: boolean): string {
  return banned ? 'danger' : 'success'
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

function formatTraffic(user: User): string {
  return `${formatBytes(user.u + user.d)} / ${formatBytes(user.transfer_enable)}`
}

function getTrafficPercent(user: User): number {
  return Math.min((user.u + user.d) / user.transfer_enable * 100, 100)
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
        <p class="text-slate-400 mt-1">管理系统用户</p>
      </div>
      <div class="flex items-center gap-3">
        <ElButton icon="Filter" text class="text-slate-300 hover:text-white" @click="showFilters = !showFilters">
          筛选
        </ElButton>
        <ElButton icon="Download" text class="text-slate-300 hover:text-white">
          导出
        </ElButton>
        <ElButton icon="Plus" type="primary" @click="router.push('/admin/user/detail/0')">
          创建用户
        </ElButton>
      </div>
    </div>

    <div v-if="showFilters" class="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 max-w-md">
          <label class="block text-sm text-slate-400 mb-2">搜索关键词</label>
          <ElInput
            v-model="searchKeyword"
            placeholder="搜索邮箱..."
            prefix-icon="Search"
          />
        </div>
        <div>
          <label class="block text-sm text-slate-400 mb-2">状态</label>
          <ElSelect v-model="statusFilter" placeholder="请选择状态">
            <ElOption v-for="option in statusOptions" :key="option.value" :label="option.label" :value="option.value" />
          </ElSelect>
        </div>
        <div class="flex items-end">
          <ElButton type="primary" @click="fetchUsers">应用筛选</ElButton>
        </div>
      </div>
    </div>

    <ElCard class="border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
          <ElCheckbox :checked="selectedUsers.length === userStore.list.length && userStore.list.length > 0" @change="selectAll">
            全选
          </ElCheckbox>
          <span v-if="selectedUsers.length > 0" class="text-slate-400 text-sm">
            已选择 {{ selectedUsers.length }} 项
          </span>
        </div>
        <div class="flex items-center gap-2">
          <ElButton icon="RefreshCw" text class="text-slate-400 hover:text-white" @click="fetchUsers">
            刷新
          </ElButton>
        </div>
      </div>

      <ElTable :data="userStore.list" :border="false" class="bg-slate-800">
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn prop="email" label="邮箱" min-width="200">
          <template #default="scope">
            <span class="text-white font-medium">{{ scope.row.email }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="plan_id" label="套餐" min-width="100">
          <template #default="scope">
            <span class="text-slate-400 text-sm">套餐 {{ scope.row.plan_id || '-' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="流量使用" min-width="200">
          <template #default="scope">
            <div>
              <div class="text-slate-400 text-sm">{{ formatTraffic(scope.row) }}</div>
              <div class="mt-1 h-1.5 w-32 bg-slate-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-indigo-500 rounded-full transition-all"
                  :style="{ width: `${getTrafficPercent(scope.row)}%` }"
                ></div>
              </div>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="balance" label="余额" min-width="100">
          <template #default="scope">
            <span class="text-green-400">¥{{ scope.row.balance.toFixed(2) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="banned" label="状态" min-width="80">
          <template #default="scope">
            <ElTag :type="getStatusType(scope.row.banned)">
              {{ getStatusText(scope.row.banned) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="created_at" label="创建时间" min-width="120">
          <template #default="scope">
            <span class="text-slate-400 text-sm">{{ formatTimestamp(scope.row.created_at) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="180">
          <template #default="scope">
            <div class="flex items-center gap-1">
              <ElButton icon="Eye" text size="small" @click="handleView(scope.row.id)" />
              <ElButton icon="Edit" text size="small" @click="handleEdit(scope.row.id)" />
              <ElButton icon="RefreshCw" text size="small" @click="handleResetTraffic(scope.row.id)" />
              <ElButton icon="Ban" text size="small" @click="handleBan(scope.row.id, !scope.row.banned)" />
              <ElButton icon="Trash2" text size="small" class="text-red-400 hover:text-red-300" @click="handleDelete(scope.row.id)" />
            </div>
          </template>
        </ElTableColumn>
      </ElTable>

      <div v-if="userStore.list.length === 0" class="py-12 text-center">
        <p class="text-slate-400">暂无数据</p>
      </div>

      <div v-if="userStore.pagination.total > 0" class="mt-4">
        <ElPagination
          :current-page="userStore.pagination.page"
          :page-size="userStore.pagination.page_size"
          :total="userStore.pagination.total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </ElCard>
  </div>
</template>
