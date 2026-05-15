<script setup lang="ts">import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { formatBytes } from '@/utils/format';
import * as planApi from '@/api/plan';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, MoreVertical } from 'lucide-vue-next';
import type { Plan } from '@/types';
const router = useRouter();
const appStore = useAppStore();
const plans = ref<Plan[]>([]);
async function fetchPlans() {
 const response = await planApi.getList();
 if (response.code === 0 && response.data) {
 plans.value = response.data;
 }
}
function handleView(id: number) {
 router.push(`/admin/plan/edit/${id}`);
}
function handleEdit(id: number) {
 router.push(`/admin/plan/edit/${id}`);
}
async function handleDelete(id: number) {
 if (confirm('确定要删除该套餐吗？')) {
 const response = await planApi.deletePlan(id);
 if (response.code === 0) {
 appStore.showToast('success', '删除成功');
 fetchPlans();
 }
 else {
 appStore.showToast('error', response.message || '删除失败');
 }
 }
}
async function handleToggle(id: number, show: boolean) {
 const response = await planApi.toggle(id, !show);
 if (response.code === 0) {
 appStore.showToast('success', !show ? '已启用' : '已禁用');
 fetchPlans();
 }
}
function formatPrice(price: number | undefined): string {
 if (price === undefined || price === 0)
 return '-';
 return `¥${price}`;
}
onMounted(() => {
 fetchPlans();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">套餐管理</h1>
        <p class="text-gray-400 mt-1">管理系统套餐</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        @click="router.push('/admin/plan/edit')"
      >
        <Plus class="w-4 h-4" />
        创建套餐
      </button>
    </div>

    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-700/50">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">套餐名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">流量</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">限速</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">价格</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">创建时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-for="plan in plans" :key="plan.id" class="hover:bg-gray-700/30 transition-colors">
              <td class="px-6 py-4">
                <span class="text-gray-400 text-sm">#{{ plan.id }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-white font-medium">{{ plan.name }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-400 text-sm">{{ formatBytes(plan.transfer_enable) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-400 text-sm">{{ plan.speed_limit ? `${plan.speed_limit} Mbps` : '不限' }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-4 text-sm">
                    <span class="text-gray-400">月付:</span>
                    <span class="text-green-400">{{ formatPrice(plan.month_price) }}</span>
                    <span class="text-gray-400">季付:</span>
                    <span class="text-green-400">{{ formatPrice(plan.quarter_price) }}</span>
                    <span class="text-gray-400">年付:</span>
                    <span class="text-green-400">{{ formatPrice(plan.year_price) }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <button
                  class="p-1.5 rounded-lg transition-colors"
                  :class="plan.show ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/20 text-gray-400'"
                  @click="handleToggle(plan.id, plan.show)"
                >
                  <ToggleRight v-if="plan.show" class="w-5 h-5" />
                  <ToggleLeft v-else class="w-5 h-5" />
                </button>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-400 text-sm">{{ new Date(plan.created_at * 1000).toLocaleDateString('zh-CN') }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    class="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                    title="查看详情"
                    @click="handleView(plan.id)"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                    title="编辑"
                    @click="handleEdit(plan.id)"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-gray-400 hover:bg-gray-700 hover:text-red-400 rounded-lg transition-colors"
                    title="删除"
                    @click="handleDelete(plan.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="plans.length === 0" class="py-12 text-center">
          <p class="text-gray-400">暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>
