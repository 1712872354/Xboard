import { get, post, put, deleteRequest } from '@/utils/request'
import type { Plan } from '@/types'

export async function getList(): Promise<{
  code: number
  message: string
  data?: Plan[]
}> {
  const response = await get('/v2/admin/plan')
  return response
}

export async function getDetail(id: number): Promise<{
  code: number
  message: string
  data?: Plan
}> {
  const response = await get(`/v2/admin/plan/${id}`)
  return response
}

export async function create(data: Record<string, any>): Promise<{
  code: number
  message: string
  data?: Plan
}> {
  const response = await post('/v2/admin/plan', data)
  return response
}

export async function update(id: number, data: Record<string, any>): Promise<{
  code: number
  message: string
  data?: Plan
}> {
  const response = await put(`/v2/admin/plan/${id}`, data)
  return response
}

export async function deletePlan(id: number): Promise<{
  code: number
  message: string
}> {
  const response = await deleteRequest(`/v2/admin/plan/${id}`)
  return response
}

export async function toggle(id: number, show: boolean): Promise<{
  code: number
  message: string
}> {
  const response = await put(`/v2/admin/plan/${id}/toggle`, { show })
  return response
}
