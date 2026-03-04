import Grid from '@mui/material/Grid'
import InputField from './InputField'
import RadioField from './Radio'
import FormTextField from './TextField'
import type { FieldDefinition, FormValues } from '../../msppage/types'

interface FormSectionProps {
  fields: FieldDefinition[]
  formValues: FormValues
  errors?: Partial<Record<string, string>>
  companies: string[]
  countries: string[]
  states: string[]
  cities: string[]
  loadingCompanies: boolean
  loadingCountries: boolean
  loadingStates: boolean
  loadingCities: boolean
  onChange: (name: string, value: string) => void
}

const STATUS_OPTIONS = [
  { label: 'active', value: 'active' },
  { label: 'inactive', value: 'inactive' }
]

const PURPOSE_OPTIONS = ['background verification', 'drug test']

const formatCountryCodePhone = (input: string): string => {
  const raw = input.replace(/[^\d+]/g, '')
  const hasPlus = raw.startsWith('+')
  const digits = raw.replace(/\D/g, '').slice(0, 13)
  if (!digits) return ''
  return `${hasPlus ? '+' : '+'}${digits}`
}

const formatZip = (input: string): string => input.replace(/\D/g, '').slice(0, 6)

const getFormattedValue = (fieldKey: string, value: string): string => {
  if (fieldKey === 'zip') return formatZip(value)
  if (fieldKey.startsWith('phone') || fieldKey === 'cell') return formatCountryCodePhone(value)
  return value
}

const FormSection: React.FC<FormSectionProps> = ({
  fields,
  formValues,
  errors,
  companies,
  countries,
  states,
  cities,
  loadingCompanies,
  loadingCountries,
  loadingStates,
  loadingCities,
  onChange
}) => {
  return (
    <Grid container spacing={2}>
      {fields.map((field) => {
        const value = formValues[field.key] ?? ''
        const errorMessage = errors?.[field.key]
        const hasError = Boolean(errorMessage)

        if (field.type === 'company') {
          return (
            <Grid item xs={12} key={field.key}>
              <FormTextField
                label={field.label}
                value={value}
                options={companies}
                loading={loadingCompanies}
                error={hasError}
                helperText={errorMessage}
                onChange={(nextValue) => onChange(field.key, nextValue)}
              />
            </Grid>
          )
        }

        if (field.type === 'country') {
          return (
            <Grid item xs={12} key={field.key}>
              <FormTextField
                label={field.label}
                value={value}
                options={countries}
                loading={loadingCountries}
                error={hasError}
                helperText={errorMessage}
                onChange={(nextValue) => onChange(field.key, nextValue)}
              />
            </Grid>
          )
        }

        if (field.type === 'state') {
          return (
            <Grid item xs={12} key={field.key}>
              <FormTextField
                label={field.label}
                value={value}
                options={states}
                disabled={!formValues.country}
                loading={loadingStates}
                error={hasError}
                helperText={errorMessage}
                onChange={(nextValue) => onChange(field.key, nextValue)}
              />
            </Grid>
          )
        }

        if (field.type === 'city') {
          return (
            <Grid item xs={12} key={field.key}>
              <FormTextField
                label={field.label}
                value={value}
                options={cities}
                disabled={!formValues.state}
                loading={loadingCities}
                error={hasError}
                helperText={errorMessage}
                onChange={(nextValue) => onChange(field.key, nextValue)}
              />
            </Grid>
          )
        }

        if (field.type === 'status') {
          return (
            <Grid item xs={12} key={field.key}>
              <RadioField
                label={field.label}
                value={value}
                options={STATUS_OPTIONS}
                error={hasError}
                helperText={errorMessage}
                onChange={(nextValue) => onChange(field.key, nextValue)}
              />
            </Grid>
          )
        }

        if (field.type === 'purpose') {
          return (
            <Grid item xs={12} key={field.key}>
              <FormTextField
                label={field.label}
                value={value}
                options={PURPOSE_OPTIONS}
                error={hasError}
                helperText={errorMessage}
                onChange={(nextValue) => onChange(field.key, nextValue)}
              />
            </Grid>
          )
        }

        return (
          <Grid item xs={12} key={field.key}>
            <InputField
              label={field.label}
              value={value}
              error={hasError}
              helperText={errorMessage}
              onChange={(nextValue) => onChange(field.key, getFormattedValue(field.key, nextValue))}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default FormSection
