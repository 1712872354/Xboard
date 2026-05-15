import { get, post, put, deleteRequest } from '@/utils/request'
import type { User, CreateUserRequest, UpdateUserRequest } from '@/types'

export async function getList(params?: {
  page?: number
  page_size?: number
  keyword?: string
  status?: number
}): Promise<{
  code: number
  message: string
  data?: {
    data: User[]
    total: number
    page: number
    page_size: number
  }
}> {
  const response = await get('/v2/admin/user', params)
  return response
}

export async function getDetail(id: number): Promise<{
  code: number
  message: string
  data?: User
}> {
  const response = await get(`/v2/admin/user/${id}`)
  return response
}

export async function create(data: CreateUserRequest): Promise<{
  code: number
  message: string
  data?: User
}> {
  const response = await post('/v2/admin/user', data)
  return response
}

export async function update(id: number, data: UpdateUserRequest): Promise<{
  code: number
  message: string
  data?: User
}> {
  const response = await put(`/v2/admin/user/${id}`, data)
  return response
}

export async function deleteUser(id: number): Promise<{
  code: number
  message: string
}> {
  const response = await deleteRequest(`/v2/admin/user/${id}`)
  return response
}

export async function resetTraffic(id: number): Promise<{
  code: number
  message: string
}> {
  const response = await post(`/v2/admin/user/${id}/reset-traffic`)
  return response
}

export async function ban(id: number, banned: boolean): Promise<{
  code: number
  message: string
}> {
  const response = await put(`/v2/admin/user/${id}/ban`, { banned })
  return response
}

export async function fetchTraffic(id: number): Promise<{
  code: number
  message: string
  data?: {
    u: number
    d: number
    transfer_enable: number
  }
}> {
  const response = await get(`/v2/admin/user/${id}/traffic`)
  return response
}
