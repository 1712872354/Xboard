import { get, post } from '@/utils/request'
import type { LoginRequest, AdminUser } from '@/types'

export interface LoginResponse {
  token: string
  user: AdminUser
}

export async function login(email: string, password: string): Promise<{
  code: number
  message: string
  data?: LoginResponse
}> {
  const response = await post('/v2/admin/login', { email, password })
  return response
}

export async function getUser(): Promise<{
  code: number
  message: string
  data?: AdminUser
}> {
  const response = await get('/v2/admin/user')
  return response
}

export async function logout(): Promise<{
  code: number
  message: string
}> {
  const response = await post('/v2/admin/logout')
  return response
}
