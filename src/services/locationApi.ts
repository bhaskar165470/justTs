import axios, { type AxiosError } from 'axios'
import { api } from './api'

export interface NamedOption {
  id: number
  name: string
}

interface IPaginationParams {
  pageNumber?: number
  pageSize?: number
  activeStatus?: 0 | 1 | null
}

type ApiListResponse<T> = T[] | { data: T[] }

const getList = <T>(payload: ApiListResponse<T>): T[] => {
  if (Array.isArray(payload)) return payload
  return payload.data
}

const handleAxiosError = (error: AxiosError): void => {
  // Keep diagnostics detailed for API troubleshooting.
  console.error('Axios request failed:', error)
  if (error.response) {
    console.error('Response data:', error.response.data)
    console.error('Response status:', error.response.status)
    console.error('Response headers:', error.response.headers)
    return
  }
  if (error.request) {
    console.error('Request:', error.request)
    return
  }
  console.error('Error:', error.message)
}

interface CompanyDto {
  companyID: number
  name: string
}

interface CountryDto {
  countryID: number
  name: string
}

interface StateDto {
  stateID: number
  name: string
}

interface CityDto {
  cityID: number
  name: string
}

const mapNamedOptions = <T>(items: T[], toOption: (item: T) => NamedOption): NamedOption[] =>
  items.map(toOption)

export const getCompanies = async (): Promise<NamedOption[]> => {
  const params: Required<IPaginationParams> = { pageNumber: 1, pageSize: 1000, activeStatus: 1 }
  try {
    const response = await api.get<ApiListResponse<CompanyDto>>('/api/ClientCompany/GetClientCompanies', { params })
    return mapNamedOptions(getList(response.data), (company) => ({
      id: company.companyID,
      name: company.name
    }))
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error)
    } else {
      console.error('Non-Axios error occurred:', error)
    }
    throw error
  }
}

export const getCountries = async (): Promise<NamedOption[]> => {
  const params: Required<IPaginationParams> = { pageNumber: 1, pageSize: 1000, activeStatus: 1 }
  try {
    const response = await api.get<ApiListResponse<CountryDto>>('/api/Location/GetCountry', { params })
    return mapNamedOptions(getList(response.data), (country) => ({
      id: country.countryID,
      name: country.name
    }))
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error)
    } else {
      console.error('Non-Axios error occurred:', error)
    }
    throw error
  }
}

export const getStatesByCountryId = async (countryId: number): Promise<NamedOption[]> => {
  // Guard against unnecessary requests when parent selection is empty.
  if (!countryId) return []
  const params: Required<IPaginationParams> = { pageNumber: 1, pageSize: 10000, activeStatus: 1 }
  try {
    const response = await api.get<ApiListResponse<StateDto>>(`/api/Location/GetStateByCountryID/${countryId}`, { params })
    return mapNamedOptions(getList(response.data), (state) => ({
      id: state.stateID,
      name: state.name
    }))
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error)
    } else {
      console.error('Non-Axios error occurred:', error)
    }
    throw error
  }
}

export const getCitiesByStateId = async (stateId: number): Promise<NamedOption[]> => {
  if (!stateId) return []
  const params: Required<IPaginationParams> = { pageNumber: 1, pageSize: 10000, activeStatus: 1 }
  try {
    const response = await api.get<ApiListResponse<CityDto>>(`/api/Location/GetCityByStateID/${stateId}`, { params })
    return mapNamedOptions(getList(response.data), (city) => ({
      id: city.cityID,
      name: city.name
    }))
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error)
    } else {
      console.error('Non-Axios error occurred:', error)
    }
    throw error
  }
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
