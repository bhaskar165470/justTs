import { useCallback, useEffect, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { PrimaryButton } from '../components/buttons'
import { FormSection } from '../components/form'
import { FORM_FIELDS, splitFieldsInHalf } from './config'
import type { FormValues } from './types'
import { useLocationOptions } from '../services/useLocationOptions'
import type { ActiveTab } from './types'
import { COUNTRY_CODE_PHONE_PATTERN } from '../utils/patterns'

interface MspDetailsProps {
  formValues: FormValues
  setMspDetailsValues: (values: FormValues) => void
  setActiveTab: (tab: ActiveTab) => void
}

const ZIP_PATTERN = /^\d{6}$/
type ValidationErrors = Partial<Record<keyof FormValues, string>>

const validateMspDetails = (values: FormValues): ValidationErrors => {
  // Keep validation close to the form so UI rules are explicit and local.
  const errors: ValidationErrors = {}

  if (!values.company) errors.company = 'company is required'
  if (!values.name) errors.name = 'name is required'
  if (!values.country) errors.country = 'country is required'
  if (!values.state) errors.state = 'state is required'
  if (!values.city) errors.city = 'city is required'
  if (!values.zip) errors.zip = 'zip is required'
  if (values.zip && !ZIP_PATTERN.test(values.zip)) errors.zip = 'zip must be 6 digits'

  ;(['phone-office', 'phone-home', 'cell'] as const).forEach((key) => {
    const value = values[key]
    if (value && !COUNTRY_CODE_PHONE_PATTERN.test(value)) {
      errors[key] = `${key} must be in +countrycode format`
    }
  })

  return errors
}

const MspDetails: React.FC<MspDetailsProps> = ({ formValues, setMspDetailsValues, setActiveTab }) => {
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const { companies, countries, states, cities, loadingCompanies, loadingCountries, loadingStates, loadingCities } = useLocationOptions({
    selectedCountry: formValues.country ?? '',
    selectedState: formValues.state ?? ''
  })
  const validate = useCallback((values: FormValues = formValues): boolean => {
    const nextErrors = validateMspDetails(values)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [formValues])

  const handleChange = (name: string, value: string) => {
    const next: FormValues = { ...formValues, [name]: value }
    // Reset dependent location fields when a parent selection changes.
    if (name === 'country') {
      next.state = ''
      next.city = ''
    }
    if (name === 'state') {
      next.city = ''
    }
    setMspDetailsValues(next)
  }

  const [leftColumnFields, rightColumnFields] = splitFieldsInHalf(FORM_FIELDS)
  const columnFieldGroups = [leftColumnFields, rightColumnFields]

  useEffect(() => {
    if (submitAttempted) {
      validate()
    }
  }, [formValues, submitAttempted, validate])

  const handleNextClick = () => {
    setSubmitAttempted(true)
    // Only unlock billing after the details section is valid.
    if (validate()) {
      setActiveTab('billing')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {columnFieldGroups.map((columnFields, index) => (
        <Box key={`column-${index}`} sx={{ width: { xs: '100%', md: 'calc(50% - 8px)' } }}>
          <FormSection
            fields={columnFields}
            formValues={formValues}
            errors={submitAttempted ? errors : {}}
            companies={companies}
            countries={countries}
            states={states}
            cities={cities}
            loadingCompanies={loadingCompanies}
            loadingCountries={loadingCountries}
            loadingStates={loadingStates}
            loadingCities={loadingCities}
            onChange={handleChange}
          />
        </Box>
      ))}

      <Box sx={{ width: '100%' }}>
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 1 }}>
          <PrimaryButton onClick={handleNextClick}>next</PrimaryButton>
        </Stack>
      </Box>
    </Box>
  )
}

export default MspDetails
