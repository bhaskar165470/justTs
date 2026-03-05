// Temporary frontend-only option source.
// Keep this until backend endpoints are finalized for MSP options.
const LOCAL_OPTIONS = {
  companies: ['Demo Company', 'Acme Logistics', 'Northwind Systems'],
  countries: ['United States'],
  statesByCountry: {
    'United States': ['California', 'Texas', 'New York', 'Florida']
  },
  citiesByState: {
    California: ['Los Angeles', 'San Francisco', 'San Diego'],
    Texas: ['Houston', 'Austin', 'Dallas'],
    'New York': ['New York City', 'Buffalo'],
    Florida: ['Miami', 'Orlando']
  }
} as const

interface UseLocationOptionsArgs {
    // Current country selected in the form; used to derive dependent states.
    selectedCountry: string
    // Current state selected in the form; used to derive dependent cities.
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
  selectedCountry,
  selectedState
}: UseLocationOptionsArgs): UseLocationOptionsResult => {
  // Static top-level lists used by company/country fields.
  const companies = [...LOCAL_OPTIONS.companies]
  const countries = [...LOCAL_OPTIONS.countries]
  // Dependent list: only show states for selected country.
  const states = selectedCountry
    ? [...(LOCAL_OPTIONS.statesByCountry[selectedCountry as keyof typeof LOCAL_OPTIONS.statesByCountry] ?? [])]
    : []
  // Dependent list: only show cities for selected state.
  const cities = selectedState
    ? [...(LOCAL_OPTIONS.citiesByState[selectedState as keyof typeof LOCAL_OPTIONS.citiesByState] ?? [])]
    : []

  return {
    companies,
    countries,
    states,
    cities,
    // Always false in static mode; these become real loading flags once API calls are enabled.
    loadingCompanies: false,
    loadingCountries: false,
    loadingStates: false,
    loadingCities: false
  }
}
