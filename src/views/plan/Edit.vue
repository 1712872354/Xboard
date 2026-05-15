<script setup lang="ts">import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import * as planApi from '@/api/plan';
import { ArrowLeft, Save } from 'lucide-vue-next';
import type { Plan } from '@/types';
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const isEdit = computed(() => !!route.params.id);
const planId = computed(() => parseInt(route.params.id as string));
const form = ref({
 name: '',
 group_id: 1,
 transfer_enable: 1024 * 1024 * 1024 * 10,
 speed_limit: undefined as number | undefined,
 month_price: undefined as number | undefined,
 quarter_price: undefined as number | undefined,
 year_price: undefined as number | undefined,
 half_year_price: undefined as number | undefined,
 two_year_price: undefined as number | undefined,
 three_year_price: undefined as number | undefined,
 onetime_price: undefined as number | undefined,
 reset_price: undefined as number | undefined,
 reset_traffic_method: 1,
 capacity_limit: undefined as number | undefined,
 show: true,
 content: ''
});
const resetMethods = [
 { value: 0, label: '每月1号' },
 { value: 1, label: '按月重置' },
 { value: 2, label: '不重置' },
 { value: 3, label: '每年1月1日' },
 { value: 4, label: '按年重置' }
];
const periods = [
 { key: 'month_price', label: '月付' },
 { key: 'quarter_price', label: '季付' },
 { key: 'half_year_price', label: '半年付' },
 { key: 'year_price', label: '年付' },
 { key: 'two_year_price', label: '两年付' },
 { key: 'three_year_price', label: '三年付' },
 { key: 'onetime_price', label: '一次性' }
];
async function fetchPlan() {
 if (!isEdit.value)
 return;
 const response = await planApi.getDetail(planId.value);
 if (response.code === 0 && response.data) {
 const plan = response.data;
 form.value = {
 name: plan.name,
 group_id: plan.group_id,
 transfer_enable: plan.transfer_enable,
 speed_limit: plan.speed_limit,
 month_price: plan.month_price,
 quarter_price: plan.quarter_price,
 year_price: plan.year_price,
 half_year_price: undefined,
 two_year_price: undefined,
 three_year_price: undefined,
 onetime_price: undefined,
 reset_price: undefined,
 reset_traffic_method: 1,
 capacity_limit: undefined,
 show: plan.show,
 content: ''
 };
 }
}
async function handleSave() {
 if (!form.value.name) {
 appStore.showToast('error', '请输入套餐名称');
 return;
 }
 const data: Record<string, any> = {
 name: form.value.name,
 group_id: form.value.group_id,
 transfer_enable: form.value.transfer_enable,
 speed_limit: form.value.speed_limit,
 month_price: form.value.month_price,
 quarter_price: form.value.quarter_price,
 year_price: form.value.year_price,
 half_year_price: form.value.half_year_price,
 two_year_price: form.value.two_year_price,
 three_year_price: form.value.three_year_price,
 onetime_price: form.value.onetime_price,
 reset_price: form.value.reset_price,
 reset_traffic_method: form.value.reset_traffic_method,
 capacity_limit: form.value.capacity_limit,
 show: form.value.show,
 content: form.value.content
 };
 let response;
 if (isEdit.value) {
 response = await planApi.update(planId.value, data);
 }
 else {
 response = await planApi.create(data);
 }
 if (response.code === 0) {
 appStore.showToast('success', isEdit.value ? '更新成功' : '创建成功');
 router.push('/admin/plan/list');
 }
 else {
 appStore.showToast('error', response.message || '操作失败');
 }
}
onMounted(() => {
 fetchPlan();
});
watch(() => route.params.id, () => {
 fetchPlan();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          @click="router.push('/admin/plan/list')"
        >
          <ArrowLeft class="w-5 h-5" />
          返回列表
        </button>
        <h1 class="text-2xl font-bold text-white">
          {{ isEdit ? '编辑套餐' : '创建套餐' }}
        </h1>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        @click="handleSave"
      >
        <Save class="w-4 h-4" />
        {{ isEdit ? '保存修改' : '创建套餐' }}
      </button>
    </div>

    <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">套餐名称 *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="请输入套餐名称"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">流量上限 (GB)</label>
          <input
            v-model.number="form.transfer_enable"
            type="number"
            placeholder="请输入流量上限"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">限速 (Mbps)</label>
          <input
            v-model.number="form.speed_limit"
            type="number"
            placeholder="留空则不限速"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">重置方式</label>
          <select
            v-model="form.reset_traffic_method"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option v-for="method in resetMethods" :key="method.value" :value="method.value">
              {{ method.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">容量限制</label>
          <input
            v-model.number="form.capacity_limit"
            type="number"
            placeholder="留空则不限"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">状态</label>
          <select
            v-model="form.show"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option :value="true">启用</option>
            <option :value="false">禁用</option>
          </select>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-700">
        <h3 class="text-lg font-medium text-white mb-4">价格设置</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="period in periods" :key="period.key">
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ period.label }} (元)</label>
            <input
              v-model.number="form[period.key as keyof typeof form]"
              type="number"
              placeholder="0"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">流量重置价格 (元)</label>
          <input
            v-model.number="form.reset_price"
            type="number"
            placeholder="留空则不可重置"
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-700">
        <h3 class="text-lg font-medium text-white mb-4">套餐描述</h3>
        <textarea
          v-model="form.content"
          rows="4"
          placeholder="请输入套餐描述"
          class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary resize-none"
        ></textarea>
      </div>
    </div>
  </div>
</template>
