import axios, { type InternalAxiosRequestConfig } from 'axios'

export const BASE_URL = import.meta.env.VITE_BASE_URL ?? ''

type TokenGetter = () => string | null | undefined

let getToken: TokenGetter = () => localStorage.getItem('token')

// Call this once when Redux auth is available
export const configureAuthTokenGetter = (tokenGetter: TokenGetter) => {
  getToken = tokenGetter
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
