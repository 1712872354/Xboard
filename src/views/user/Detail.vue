<script setup lang="ts">import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAppStore } from '@/stores/app';
import { formatBytes, formatTimestamp } from '@/utils/format';
import { ArrowLeft, Save, RefreshCw, Ban, CreditCard, Gift, Settings } from 'lucide-vue-next';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore();
const isEdit = computed(() => parseInt(route.params.id as string) > 0);
const userId = computed(() => parseInt(route.params.id as string));
const activeTab = ref('basic');
const form = ref({
 email: '',
 password: '',
 plan_id: undefined as number | undefined,
 group_id: undefined as number | undefined,
 transfer_enable: undefined as number | undefined,
 speed_limit: undefined as number | undefined,
 balance: 0
});
const tabs = [
 { id: 'basic', name: '基本信息', icon: Settings },
 { id: 'traffic', name: '流量管理', icon: RefreshCw },
 { id: 'orders', name: '订单记录', icon: CreditCard },
 { id: 'giftcards', name: '礼品卡', icon: Gift }
];
const plans = ref([
 { id: 1, name: '基础套餐' },
 { id: 2, name: '高级套餐' },
 { id: 3, name: '尊享套餐' }
]);
const groups = ref([
 { id: 1, name: '默认分组' },
 { id: 2, name: 'VIP分组' }
]);
async function fetchUser() {
 if (!isEdit.value)
 return;
 const response = await userStore.fetchDetail(userId.value);
 if (response.code === 0 && response.data) {
 const user = response.data;
 form.value = {
 email: user.email,
 password: '',
 plan_id: user.plan_id,
 group_id: user.group_id,
 transfer_enable: user.transfer_enable,
 speed_limit: user.speed_limit,
 balance: user.balance
 };
 }
}
async function handleSave() {
 if (!form.value.email) {
 appStore.showToast('error', '请输入邮箱');
 return;
 }
 if (!isEdit.value && !form.value.password) {
 appStore.showToast('error', '请输入密码');
 return;
 }
 const data: Record<string, any> = {
 email: form.value.email,
 plan_id: form.value.plan_id,
 group_id: form.value.group_id,
 transfer_enable: form.value.transfer_enable,
 speed_limit: form.value.speed_limit,
 balance: form.value.balance
 };
 if (form.value.password) {
 data.password = form.value.password;
 }
 let response;
 if (isEdit.value) {
 response = await userStore.update(userId.value, data);
 }
 else {
 response = await userStore.create(data);
 }
 if (response.code === 0) {
 appStore.showToast('success', isEdit.value ? '更新成功' : '创建成功');
 router.push('/admin/user/list');
 }
 else {
 appStore.showToast('error', response.message || '操作失败');
 }
}
async function handleResetTraffic() {
 const response = await userStore.resetTraffic(userId.value);
 if (response.code === 0) {
 appStore.showToast('success', '流量已重置');
 fetchUser();
 }
}
async function handleBan(banned: boolean) {
 const response = await userStore.ban(userId.value, banned);
 if (response.code === 0) {
 appStore.showToast('success', banned ? '已封禁' : '已解封');
 }
}
onMounted(() => {
 fetchUser();
});
watch(() => route.params.id, () => {
 fetchUser();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          @click="router.push('/admin/user/list')"
        >
          <ArrowLeft class="w-5 h-5" />
          返回列表
        </button>
        <h1 class="text-2xl font-bold text-white">
          {{ isEdit ? '编辑用户' : '创建用户' }}
        </h1>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        @click="handleSave"
      >
        <Save class="w-4 h-4" />
        {{ isEdit ? '保存修改' : '创建用户' }}
      </button>
    </div>

    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div class="flex border-b border-gray-700">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors"
          :class="activeTab === tab.id ? 'text-primary border-b-2 border-primary bg-gray-700/50' : 'text-gray-400 hover:text-white hover:bg-gray-700/30'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.name }}
        </button>
      </div>

      <div class="p-6">
        <div v-if="activeTab === 'basic'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">邮箱 *</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="请输入邮箱"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ isEdit ? '新密码' : '密码 *' }}
              </label>
              <input
                v-model="form.password"
                type="password"
                :placeholder="isEdit ? '留空则不修改密码' : '请输入密码'"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">套餐</label>
              <select
                v-model="form.plan_id"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option :value="undefined">请选择套餐</option>
                <option v-for="plan in plans" :key="plan.id" :value="plan.id">
                  {{ plan.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">分组</label>
              <select
                v-model="form.group_id"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option :value="undefined">请选择分组</option>
                <option v-for="group in groups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </option>
              </select>
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
                placeholder="请输入限速"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">余额</label>
              <input
                v-model.number="form.balance"
                type="number"
                placeholder="请输入余额"
                class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'traffic'" class="space-y-6">
          <div class="bg-gray-700/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-gray-300 font-medium">流量使用情况</h3>
              <button
                v-if="isEdit"
                class="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                @click="handleResetTraffic"
              >
                <RefreshCw class="w-4 h-4" />
                重置流量
              </button>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <p class="text-gray-400 text-sm">上行流量</p>
                <p class="text-xl font-bold text-white mt-1">{{ formatBytes(userStore.selectedUser?.u || 0) }}</p>
              </div>
              <div class="text-center">
                <p class="text-gray-400 text-sm">下行流量</p>
                <p class="text-xl font-bold text-white mt-1">{{ formatBytes(userStore.selectedUser?.d || 0) }}</p>
              </div>
              <div class="text-center">
                <p class="text-gray-400 text-sm">剩余流量</p>
                <p class="text-xl font-bold text-green-400 mt-1">
                  {{ formatBytes((userStore.selectedUser?.transfer_enable || 0) - (userStore.selectedUser?.u || 0) - (userStore.selectedUser?.d || 0)) }}
                </p>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-400">流量进度</span>
                <span class="text-white">
                  {{ formatBytes((userStore.selectedUser?.u || 0) + (userStore.selectedUser?.d || 0)) }} / {{ formatBytes(userStore.selectedUser?.transfer_enable || 0) }}
                </span>
              </div>
              <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-primary to-green-400 rounded-full"
                  :style="{ width: `${Math.min(((userStore.selectedUser?.u || 0) + (userStore.selectedUser?.d || 0)) / (userStore.selectedUser?.transfer_enable || 1) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'orders'" class="text-center py-12">
          <p class="text-gray-400">暂无订单记录</p>
        </div>

        <div v-if="activeTab === 'giftcards'" class="text-center py-12">
          <p class="text-gray-400">暂无礼品卡记录</p>
        </div>
      </div>
    </div>
  </div>
</template>
