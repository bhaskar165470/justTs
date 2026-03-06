import { api } from './api'

export interface NamedOption {
  id: number
  name: string
}

const toArray = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[]
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    const candidates = ['data', 'items', 'result', 'results', 'records']
    for (const key of candidates) {
      const value = record[key]
      if (Array.isArray(value)) return value as Record<string, unknown>[]
    }
    return [record]
  }
  return []
}

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

const asString = (value: unknown): string => (typeof value === 'string' ? value : '')

const mapOptions = (
  items: Record<string, unknown>[],
  idKeys: string[],
  nameKeys: string[]
): NamedOption[] => {
  const result = items
    .map((item) => {
      const id = idKeys.map((key) => asNumber(item[key])).find((value): value is number => value !== null)
      const name = nameKeys.map((key) => asString(item[key])).find((value) => Boolean(value)) ?? ''
      if (id === null || !name) return null
      return { id, name }
    })
    .filter((option): option is NamedOption => Boolean(option))

  const dedupedByName = new Map<string, NamedOption>()
  result.forEach((option) => {
    const key = option.name
    if (!dedupedByName.has(key)) {
      dedupedByName.set(key, option)
    }
  })

  return [...dedupedByName.values()]
}

export const getCompanies = async (): Promise<NamedOption[]> => {
  const response = await api.get('/api/ClientCompany/GetClientCompanies', {
    params: { pageNumber: 1, pageSize: 500, ActiveStatus: 1 }
  })
  return mapOptions(toArray(response.data), ['companyID', 'companyId', 'id'], ['name', 'companyName'])
}

export const getCountries = async (): Promise<NamedOption[]> => {
  const response = await api.get('/api/Location/GetCountry', {
    params: { pageNumber: 1, pageSize: 500, ActiveStatus: 1 }
  })
  return mapOptions(toArray(response.data), ['countryID', 'countryId', 'id'], ['name', 'countryName'])
}

export const getStatesByCountryId = async (countryId: number): Promise<NamedOption[]> => {
  if (!countryId) return []
  const response = await api.get(`/api/Location/GetStateByCountryID/${countryId}`, {
    params: { pageNumber: 1, pageSize: 500, ActiveStatus: 1 }
  })
  return mapOptions(toArray(response.data), ['stateID', 'stateId', 'id'], ['name', 'stateName'])
}

export const getCitiesByStateId = async (stateId: number): Promise<NamedOption[]> => {
  if (!stateId) return []
  const response = await api.get(`/api/Location/GetCityByStateID/${stateId}`, {
    params: { pageNumber: 1, pageSize: 1000, ActiveStatus: 1 }
  })
  return mapOptions(toArray(response.data), ['cityID', 'cityId', 'id'], ['name', 'cityName'])
}

export const resolveCompanyByName = async (name: string): Promise<NamedOption | null> => {
  if (!name) return null
  const companies = await getCompanies()
  return companies.find((company) => company.name === name) ?? null
}

export const resolveCountryByName = async (name: string): Promise<NamedOption | null> => {
  if (!name) return null
  const countries = await getCountries()
  return countries.find((country) => country.name === name) ?? null
}

export const resolveStateByName = async (
  countryId: number,
  name: string
): Promise<NamedOption | null> => {
  if (!countryId || !name) return null
  const states = await getStatesByCountryId(countryId)
  return states.find((state) => state.name === name) ?? null
}

export const resolveCityByName = async (stateId: number, name: string): Promise<NamedOption | null> => {
  if (!stateId || !name) return null
  const cities = await getCitiesByStateId(stateId)
  return cities.find((city) => city.name === name) ?? null
}
