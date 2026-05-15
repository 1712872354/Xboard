export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
  error?: string
}

export interface PaginationResponse<T = any> {
  data: T[]
  total: number
  page: number
  page_size: number
}

export interface Pagination {
  page: number
  page_size: number
  total: number
}

export interface User {
  id: number
  email: string
  plan_id?: number
  group_id?: number
  transfer_enable: number
  speed_limit?: number
  u: number
  d: number
  banned: boolean
  expired_at?: number
  balance: number
  created_at: number
  updated_at: number
}

export interface Plan {
  id: number
  name: string
  group_id: number
  transfer_enable: number
  speed_limit?: number
  month_price?: number
  quarter_price?: number
  year_price?: number
  show: boolean
  created_at: number
  updated_at: number
}

export interface Server {
  id: number
  name: string
  type: string
  host: string
  port: string
  group_ids: string
  show: boolean
  rate: number
  created_at: number
  updated_at: number
}

export interface Order {
  id: number
  user_id: number
  plan_id: number
  period: string
  trade_no: string
  total_amount: number
  status: number
  created_at: number
  paid_at?: number
}

export interface Ticket {
  id: number
  user_id: number
  subject: string
  status: number
  reply_status: number
  created_at: number
  updated_at: number
}

export interface AdminUser {
  id: number
  email: string
  is_admin: boolean
  is_staff: boolean
}

export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export type PeriodType = 'month' | 'quarter' | 'half_year' | 'year' | 'two_year' | 'three_year' | 'onetime'

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface CreateUserRequest {
  email: string
  password: string
  plan_id?: number
  group_id?: number
  transfer_enable?: number
  speed_limit?: number
  balance?: number
}

export interface UpdateUserRequest {
  email?: string
  plan_id?: number
  group_id?: number
  transfer_enable?: number
  speed_limit?: number
  balance?: number
  banned?: boolean
}
