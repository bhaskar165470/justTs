import axios from 'axios'

export interface LocationApiUser {
  login: string
  email: string
  pass: string
  company: string
}

export const BASE_URL = 'https://example.com/api'

export const LOCATION_API_USER: LocationApiUser = {
  login: 'demo@demo.com',
  email: 'demo@demo.com',
  pass: 'demo123',
  company: 'demo'
}

const ENDPOINTS = {
  companies: '/companies',
  countries: '/countries',
  states: '/states',
  cities: '/cities'
}

const FALLBACK_COMPANIES = ['demo company']
const FALLBACK_COUNTRIES = ['United States']
const FALLBACK_STATES = ['California', 'Texas', 'New York', 'Florida']
const FALLBACK_CITIES: Record<string, string[]> = {
  California: ['Los Angeles', 'San Francisco', 'San Diego'],
  Texas: ['Houston', 'Austin', 'Dallas'],
  'New York': ['New York City', 'Buffalo'],
  Florida: ['Miami', 'Orlando']
}

const normalizeList = (payload: any): string[] => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.states)) return payload.data.states.map((state: { name: string }) => state.name)
  if (Array.isArray(payload?.states)) return payload.states
  if (Array.isArray(payload?.cities)) return payload.cities
  if (Array.isArray(payload?.countries)) return payload.countries
  return []
}

const buildUrl = (baseUrl: string, path: string): string => `${baseUrl.replace(/\/+$/, '')}${path}`

const postWithUser = async (
  baseUrl: string,
  path: string,
  payload: Record<string, string>
): Promise<any> => {
  const response = await axios.post(buildUrl(baseUrl, path), { ...LOCATION_API_USER, ...payload })
  return response.data
}

export const getCountries = async (baseUrl = BASE_URL): Promise<string[]> => {
  try {
    const data = await postWithUser(baseUrl, ENDPOINTS.countries, {})
    return normalizeList(data)
  } catch {
    return FALLBACK_COUNTRIES
  }
}

export const getCompanies = async (baseUrl = BASE_URL): Promise<string[]> => {
  try {
    const data = await postWithUser(baseUrl, ENDPOINTS.companies, {})
    return normalizeList(data)
  } catch {
    return FALLBACK_COMPANIES
  }
}

export const getStates = async (country: string, baseUrl = BASE_URL): Promise<string[]> => {
  if (!country) return []

  try {
    const data = await postWithUser(baseUrl, ENDPOINTS.states, { country })
    return normalizeList(data)
  } catch {
    return FALLBACK_STATES
  }
}

export const getCities = async (
  country: string,
  state: string,
  baseUrl = BASE_URL
): Promise<string[]> => {
  if (!country || !state) return []

  try {
    const data = await postWithUser(baseUrl, ENDPOINTS.cities, { country, state })
    return normalizeList(data)
  } catch {
    return FALLBACK_CITIES[state] || []
  }
}
