import cookies from 'js-cookie'

export const tokenKey = 'token'

export const getToken = () => cookies.get(tokenKey)

export const setToken = (token: string) =>
  cookies.set(tokenKey, token, { expires: 30 })

export const clearToken = () => cookies.remove(tokenKey)
