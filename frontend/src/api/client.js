import axios from 'axios'

/**
 * Shared API client. The current backend returns JSON tokens and uses wildcard
 * CORS, which browsers cannot combine with credentialed requests. Enable this
 * only after backend CORS and HTTP-only cookie authentication are configured.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true',
  headers: { 'Content-Type': 'application/json' },
})

export const getApiError = (error) =>
  error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Something went wrong. Please try again.'
