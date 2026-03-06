import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

export const BASE_URL = import.meta.env.VITE_BASE_URL ?? ''

type TokenGetter = () => string | null | undefined
type ApiErrorHandler = (error: AxiosError) => void

let getToken: TokenGetter = () => localStorage.getItem('token')
let onApiError: ApiErrorHandler | null = null

export const configureAuthTokenGetter = (tokenGetter: TokenGetter) => {
  getToken = tokenGetter
}

export const configureApiErrorHandler = (errorHandler: ApiErrorHandler) => {
  onApiError = errorHandler
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (onApiError) {
      onApiError(error)
    }
    return Promise.reject(error)
  }
)
