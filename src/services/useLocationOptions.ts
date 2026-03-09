import { useEffect, useMemo, useState } from 'react'
import {
  getCitiesByStateId,
  getCompanies,
  getCountries,
  getStatesByCountryId,
  type NamedOption
} from './locationApi'

interface UseLocationOptionsArgs {
  selectedCountry: string
  selectedState: string
}

interface UseLocationOptionsResult {
  companies: string[]
  countries: string[]
  states: string[]
  cities: string[]
  loadingCompanies: boolean
  loadingCountries: boolean
  loadingStates: boolean
  loadingCities: boolean
}

const findOptionIdByName = (options: NamedOption[], name: string): number | null => {
  const selectedName = name.trim()
  if (!selectedName) return null
  // APIs work with numeric ids, while form state stores display names.
  const found = options.find((option) => option.name === selectedName)
  return found?.id ?? null
}

export const useLocationOptions = ({
  selectedCountry,
  selectedState
}: UseLocationOptionsArgs): UseLocationOptionsResult => {
  const [companyOptions, setCompanyOptions] = useState<NamedOption[]>([])
  const [countryOptions, setCountryOptions] = useState<NamedOption[]>([])
  const [stateOptions, setStateOptions] = useState<NamedOption[]>([])
  const [cityOptions, setCityOptions] = useState<NamedOption[]>([])

  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  useEffect(() => {
    // Prevent state updates when the component unmounts mid-request.
    let active = true

    const loadTopLevel = async () => {
      try {
        // Load independent top-level lists in parallel for faster first render.
        setLoadingCompanies(true)
        setLoadingCountries(true)
        const [companies, countries] = await Promise.all([getCompanies(), getCountries()])
        if (!active) return
        setCompanyOptions(companies)
        setCountryOptions(countries)
      } catch {
        if (!active) return
        setCompanyOptions([])
        setCountryOptions([])
      } finally {
        if (!active) return
        setLoadingCompanies(false)
        setLoadingCountries(false)
      }
    }

    void loadTopLevel()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    // Country selection drives the available states (and clears stale dependent data).
    let active = true

    const loadStates = async () => {
      const countryId = findOptionIdByName(countryOptions, selectedCountry)
      if (!countryId) {
        setStateOptions([])
        setCityOptions([])
        return
      }

      try {
        setLoadingStates(true)
        const states = await getStatesByCountryId(countryId)
        if (!active) return
        setStateOptions(states)
      } catch {
        if (!active) return
        setStateOptions([])
      } finally {
        if (!active) return
        setLoadingStates(false)
      }
    }

    void loadStates()

    return () => {
      active = false
    }
  }, [countryOptions, selectedCountry])

  useEffect(() => {
    // State selection drives the available cities.
    let active = true

    const loadCities = async () => {
      const stateId = findOptionIdByName(stateOptions, selectedState)
      if (!stateId) {
        setCityOptions([])
        return
      }

      try {
        setLoadingCities(true)
        const cities = await getCitiesByStateId(stateId)
        if (!active) return
        setCityOptions(cities)
      } catch {
        if (!active) return
        setCityOptions([])
      } finally {
        if (!active) return
        setLoadingCities(false)
      }
    }

    void loadCities()

    return () => {
      active = false
    }
  }, [selectedState, stateOptions])

  // Expose simple string arrays for dropdown components.
  const companies = useMemo(() => companyOptions.map((option) => option.name), [companyOptions])
  const countries = useMemo(() => countryOptions.map((option) => option.name), [countryOptions])
  const states = useMemo(() => stateOptions.map((option) => option.name), [stateOptions])
  const cities = useMemo(() => cityOptions.map((option) => option.name), [cityOptions])

  return {
    companies,
    countries,
    states,
    cities,
    loadingCompanies,
    loadingCountries,
    loadingStates,
    loadingCities
  }
}
