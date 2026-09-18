import { apiClient as client, getApiError } from '../api/client'
let accessToken = null
let refreshPromise = null
const REFRESH_KEY = 'slks_refresh_token'
const setAccessToken = (token) => { accessToken = token || null }
const persistRefreshToken = (token) => { if (token) sessionStorage.setItem(REFRESH_KEY, token); else sessionStorage.removeItem(REFRESH_KEY) }
const refreshSession = (token) => {
  refreshPromise ??= client.post('/auth/refresh-token', { refreshToken: token })
    .then(({ data }) => { setAccessToken(data.accessToken); persistRefreshToken(data.refreshToken); return data })
    .finally(() => { refreshPromise = null })
  return refreshPromise
}
client.interceptors.request.use((config) => { if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`; return config })
client.interceptors.response.use((response) => response, async (error) => {
  const original = error.config
  if (error.response?.status !== 401 || original?._retry || original?.url?.includes('/auth/refresh-token')) throw error
  const token = sessionStorage.getItem(REFRESH_KEY); if (!token) throw error; original._retry = true
  const data = await refreshSession(token); original.headers.Authorization = `Bearer ${data.accessToken}`; return client(original)
})
const getErrorMessage = getApiError
export const authService = {
  register: async (payload) => (await client.post('/auth/register', payload)).data,
  async login({ email, password }) { const { data } = await client.post('/auth/login', { email, password }); setAccessToken(data.accessToken); persistRefreshToken(data.refreshToken); return data },
  verifyEmail: async (token) => (await client.post('/auth/verify-email', { token })).data,
  resendVerification: async (email) => (await client.post('/auth/resend-verification', { email })).data,
  forgotPassword: async (email) => (await client.post('/auth/forgot-password', { email })).data,
  resetPassword: async (payload) => (await client.post('/auth/reset-password', payload)).data,
  getMe: async () => (await client.get('/auth/me')).data,
  async restoreSession() { const refreshToken = sessionStorage.getItem(REFRESH_KEY); if (!refreshToken) return null; return (await refreshSession(refreshToken)).user },
  clearSession() { setAccessToken(null); persistRefreshToken(null) },
  async logout() { const refreshToken = sessionStorage.getItem(REFRESH_KEY); try { if (refreshToken) await client.post('/auth/logout', { refreshToken }) } finally { setAccessToken(null); persistRefreshToken(null) } },
  getErrorMessage,
}
