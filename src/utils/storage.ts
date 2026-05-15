export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to set localStorage item:', e)
  }
}

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (e) {
    console.error('Failed to get localStorage item:', e)
    return null
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error('Failed to remove localStorage item:', e)
  }
}

export function clear(): void {
  try {
    localStorage.clear()
  } catch (e) {
    console.error('Failed to clear localStorage:', e)
  }
}

const TOKEN_KEY = 'xboard_admin_token'
const USER_KEY = 'xboard_admin_user'
const REMEMBER_KEY = 'xboard_admin_remember'

export function getToken(): string | null {
  return getItem<string>(TOKEN_KEY)
}

export function setToken(token: string): void {
  setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  removeItem(TOKEN_KEY)
}

export function getUser<T>(): T | null {
  return getItem<T>(USER_KEY)
}

export function setUser<T>(user: T): void {
  setItem(USER_KEY, user)
}

export function removeUser(): void {
  removeItem(USER_KEY)
}

export function getRemember(): boolean {
  return getItem<boolean>(REMEMBER_KEY) || false
}

export function setRemember(remember: boolean): void {
  setItem(REMEMBER_KEY, remember)
}

export function clearAuth(): void {
  removeToken()
  removeUser()
}
