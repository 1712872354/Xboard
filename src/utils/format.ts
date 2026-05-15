export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function formatCurrency(amount: number): string {
  return amount.toFixed(2)
}

export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  
  if (days > 0) {
    return `${days}天${hours}小时${minutes}分钟`
  } else if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  } else {
    return `${minutes}分钟`
  }
}

export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function getStatusText(status: number, type: 'order' | 'ticket' | 'user'): string {
  const statusMap: Record<string, Record<number, string>> = {
    order: {
      0: '待支付',
      1: '开通中',
      2: '已取消',
      3: '已完成',
      4: '已折抵'
    },
    ticket: {
      0: '已开启',
      1: '已关闭'
    },
    user: {
      0: '正常',
      1: '封禁'
    }
  }
  
  return statusMap[type]?.[status] || '未知'
}

export function getStatusClass(status: number, type: 'order' | 'ticket' | 'user'): string {
  const classMap: Record<string, Record<number, string>> = {
    order: {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-gray-100 text-gray-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-purple-100 text-purple-800'
    },
    ticket: {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-gray-100 text-gray-800'
    },
    user: {
      0: 'bg-green-100 text-green-800',
      1: 'bg-red-100 text-red-800'
    }
  }
  
  return classMap[type]?.[status] || 'bg-gray-100 text-gray-800'
}
