<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="page-container">
    <el-card v-if="loading" class="text-center py-12">
      <el-spinner size="large" />
    </el-card>
    <el-card v-else class="text-center py-12">
      <el-icon class="text-6xl text-gray-400 mb-4" size="64">
        <Settings />
      </el-icon>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">系统配置</h2>
      <p class="text-gray-500">系统配置功能开发中...</p>
    </el-card>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
  min-height: 100%;
}
</style>
