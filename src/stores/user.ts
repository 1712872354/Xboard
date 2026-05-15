import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Pagination, PaginationResponse } from '@/types'
import * as userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const list = ref<User[]>([])
  const pagination = ref<Pagination>({ page: 1, page_size: 20, total: 0 })
  const selectedUser = ref<User | null>(null)

  async function fetchList(params?: {
    page?: number
    page_size?: number
    keyword?: string
    status?: number
  }) {
    const response = await userApi.getList(params)
    if (response.code === 0 && response.data) {
      const data = response.data as PaginationResponse<User>
      list.value = data.data
      pagination.value = {
        page: data.page,
        page_size: data.page_size,
        total: data.total
      }
    }
    return response
  }

  async function fetchDetail(id: number) {
    const response = await userApi.getDetail(id)
    if (response.code === 0 && response.data) {
      selectedUser.value = response.data as User
    }
    return response
  }

  async function create(data: Record<string, any>) {
    return await userApi.create(data as any)
  }

  async function update(id: number, data: Record<string, any>) {
    return await userApi.update(id, data as any)
  }

  async function del(id: number) {
    const response = await userApi.deleteUser(id)
    if (response.code === 0) {
      list.value = list.value.filter(u => u.id !== id)
      pagination.value.total--
    }
    return response
  }

  async function resetTraffic(id: number) {
    return await userApi.resetTraffic(id)
  }

  async function ban(id: number, banned: boolean) {
    return await userApi.ban(id, banned)
  }

  function clearSelected() {
    selectedUser.value = null
  }

  return {
    list,
    pagination,
    selectedUser,
    fetchList,
    fetchDetail,
    create,
    update,
    del,
    resetTraffic,
    ban,
    clearSelected
  }
})
