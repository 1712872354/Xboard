import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token && config.headers) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    const appStore = useAppStore()
    const authStore = useAuthStore()
    
    if (error.response?.status === 401) {
      authStore.logout()
      appStore.showToast('error', '登录已过期，请重新登录')
    } else if (error.response?.data?.message) {
      appStore.showToast('error', error.response.data.message)
    }
    
    return Promise.reject(error)
  }
)

export async function get<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
  const response = await axiosInstance.get<ApiResponse<T>>(url, { params })
  return response.data
}

export async function post<T = any>(url: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
  const response = await axiosInstance.post<ApiResponse<T>>(url, data)
  return response.data
}

export async function put<T = any>(url: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
  const response = await axiosInstance.put<ApiResponse<T>>(url, data)
  return response.data
}

export async function deleteRequest<T = any>(url: string): Promise<ApiResponse<T>> {
  const response = await axiosInstance.delete<ApiResponse<T>>(url)
  return response.data
}

export default axiosInstance
