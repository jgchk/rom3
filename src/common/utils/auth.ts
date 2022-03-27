const tokenKey = 'token'

export const getToken = () => localStorage.getItem(tokenKey) ?? undefined

export const setToken = (token: string) => localStorage.setItem(tokenKey, token)

export const clearToken = () => localStorage.removeItem(tokenKey)
