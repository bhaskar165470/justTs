import { api } from './api'

export const getCompanies = async (): Promise<string[]> => {
  const res = await api.get('/companies')
  return Array.isArray(res.data) ? res.data : res.data?.data ?? []
}

export const getCountries = async (): Promise<string[]> => {
  const res = await api.get('/countries')
  return Array.isArray(res.data) ? res.data : res.data?.data ?? []
}

export const getStates = async (country: string): Promise<string[]> => {
  if (!country) return []
  const res = await api.get('/states', { params: { country } })
  return Array.isArray(res.data) ? res.data : res.data?.data ?? []
}

export const getCities = async (country: string, state: string): Promise<string[]> => {
  if (!country || !state) return []
  const res = await api.get('/cities', { params: { country, state } })
  return Array.isArray(res.data) ? res.data : res.data?.data ?? []
}
