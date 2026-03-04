import { useEffect, useState } from 'react'
import { getCities, getCompanies, getCountries, getStates, BASE_URL } from './locationApi'

interface UseLocationOptionsArgs {
    baseUrl?: string
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

export const useLocationOptions = ({
    baseUrl = BASE_URL,
    selectedCountry,
    selectedState
}: UseLocationOptionsArgs): UseLocationOptionsResult => {
    const [companies, setCompanies] = useState<string[]>([])
    const [countries, setCountries] = useState<string[]>([])
    const [states, setStates] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [loadingCompanies, setLoadingCompanies] = useState(false)
    const [loadingCountries, setLoadingCountries] = useState(false)
    const [loadingStates, setLoadingStates] = useState(false)
    const [loadingCities, setLoadingCities] = useState(false)

    useEffect(() => {
        const loadCompanies = async () => {
            setLoadingCompanies(true)
            try {
                const companyList = await getCompanies(baseUrl)
                setCompanies(companyList)
            } catch {
                setCompanies([])
            } finally {
                setLoadingCompanies(false)
            }
        }

        loadCompanies()
    }, [baseUrl])

    useEffect(() => {
        const loadCountries = async () => {
            setLoadingCountries(true)
            try {
                const countryList = await getCountries(baseUrl)
                setCountries(countryList)
            } catch {
                setCountries([])
            } finally {
                setLoadingCountries(false)
            }
        }

        loadCountries()
    }, [baseUrl])

    useEffect(() => {
        const loadStates = async () => {
            if (!selectedCountry) {
                setStates([])
                return
            }

            setLoadingStates(true)
            try {
                const stateList = await getStates(selectedCountry, baseUrl)
                setStates(stateList)
            } catch {
                setStates([])
            } finally {
                setLoadingStates(false)
            }
        }

        loadStates()
    }, [selectedCountry, baseUrl])

    useEffect(() => {
        const loadCities = async () => {
            if (!selectedState) {
                setCities([])
                return
            }

            setLoadingCities(true)
            try {
                const cityList = await getCities(selectedCountry, selectedState, baseUrl)
                setCities(cityList)
            } catch {
                setCities([])
            } finally {
                setLoadingCities(false)
            }
        }

        loadCities()
    }, [selectedCountry, selectedState, baseUrl])

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
