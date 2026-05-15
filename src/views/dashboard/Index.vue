<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { ElCard, ElButton, ElProgress } from 'element-plus'
import { Users, ShoppingCart, Server, DollarSign, TrendingUp, Activity, Plus, Package, Bell } from 'lucide-vue-next'
import { formatBytes, formatCurrency } from '@/utils/format'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const stats = ref({
  userCount: 12580,
  orderCount: 3240,
  serverCount: 48,
  totalRevenue: 156800
})

const trafficData = ref({
  used: 185000000000,
  total: 500000000000
})

const chartOption = {
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderColor: '#475569',
    textStyle: {
      color: '#e2e8f0'
    }
  },
  legend: {
    data: ['订单数', '收入'],
    textStyle: {
      color: '#94a3b8'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisLabel: {
      color: '#94a3b8'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#475569'
      }
    },
    axisLabel: {
      color: '#94a3b8'
    },
    splitLine: {
      lineStyle: {
        color: '#334155'
      }
    }
  },
  series: [
    {
      name: '订单数',
      type: 'line',
      smooth: true,
      data: [1200, 1320, 1010, 1340, 1900, 2300, 3240],
      lineStyle: {
        color: '#10b981',
        width: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
          ]
        }
      }
    },
    {
      name: '收入',
      type: 'line',
      smooth: true,
      data: [15000, 22000, 18000, 25000, 32000, 45000, 55800],
      lineStyle: {
        color: '#4f46e5',
        width: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(79, 70, 229, 0.3)' },
            { offset: 1, color: 'rgba(79, 70, 229, 0.05)' }
          ]
        }
      }
    }
  ]
}

const quickActions = [
  { name: '创建用户', icon: Users, color: 'bg-green-500/20 text-green-400' },
  { name: '添加套餐', icon: Package, color: 'bg-blue-500/20 text-blue-400' },
  { name: '新增节点', icon: Server, color: 'bg-purple-500/20 text-purple-400' },
  { name: '发布公告', icon: Bell, color: 'bg-orange-500/20 text-orange-400' }
]

onMounted(() => {
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">仪表板</h1>
        <p class="text-slate-400 mt-1">欢迎回来，查看系统概览</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg">
        <TrendingUp class="w-4 h-4 text-green-400" />
        <span class="text-sm text-slate-300">数据更新于 5 分钟前</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ElCard class="border-slate-700 hover:border-slate-600 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">总用户数</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.userCount.toLocaleString() }}</p>
            <p class="text-green-400 text-sm mt-2 flex items-center gap-1">
              <TrendingUp class="w-4 h-4" />
              +12.5% 较上月
            </p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Users class="w-6 h-6 text-green-400" />
          </div>
        </div>
      </ElCard>

      <ElCard class="border-slate-700 hover:border-slate-600 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">本月订单</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.orderCount.toLocaleString() }}</p>
            <p class="text-green-400 text-sm mt-2 flex items-center gap-1">
              <TrendingUp class="w-4 h-4" />
              +8.3% 较上月
            </p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <ShoppingCart class="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </ElCard>

      <ElCard class="border-slate-700 hover:border-slate-600 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">在线节点</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.serverCount }}</p>
            <p class="text-green-400 text-sm mt-2">全部在线</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Server class="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </ElCard>

      <ElCard class="border-slate-700 hover:border-slate-600 transition-colors">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-slate-400 text-sm">本月收入</p>
            <p class="text-3xl font-bold text-white mt-2">¥{{ formatCurrency(stats.totalRevenue) }}</p>
            <p class="text-green-400 text-sm mt-2 flex items-center gap-1">
              <TrendingUp class="w-4 h-4" />
              +15.2% 较上月
            </p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-orange-400" />
          </div>
        </div>
      </ElCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ElCard class="lg:col-span-2 border-slate-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-white">趋势图表</h2>
          <div class="flex items-center gap-2">
            <ElButton size="small" type="primary">7日</ElButton>
            <ElButton size="small" class="text-slate-400 hover:text-white">30日</ElButton>
            <ElButton size="small" class="text-slate-400 hover:text-white">90日</ElButton>
          </div>
        </div>
        <v-chart :option="chartOption" class="h-64" autoresize />
      </ElCard>

      <ElCard class="border-slate-700">
        <h2 class="text-lg font-semibold text-white mb-4">流量使用</h2>
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-slate-400 text-sm">已使用</span>
              <span class="text-white text-sm">{{ formatBytes(trafficData.used) }}</span>
            </div>
            <ElProgress
              :percentage="(trafficData.used / trafficData.total) * 100"
              :show-text="false"
              stroke-width="8"
              class="bg-slate-700"
            />
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-400">总流量</span>
            <span class="text-white">{{ formatBytes(trafficData.total) }}</span>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-slate-700">
          <h3 class="text-sm font-medium text-slate-300 mb-4">快捷操作</h3>
          <div class="grid grid-cols-2 gap-3">
            <ElButton
              v-for="action in quickActions"
              :key="action.name"
              text
              class="flex items-center justify-center gap-2 p-3 bg-slate-700/50 hover:bg-slate-700 transition-colors"
            >
              <component :is="action.icon" class="w-5 h-5" :class="action.color.split(' ')[1]" />
              <span class="text-sm text-slate-300">{{ action.name }}</span>
            </ElButton>
          </div>
        </div>
      </ElCard>
    </div>
  </div>
</template>
