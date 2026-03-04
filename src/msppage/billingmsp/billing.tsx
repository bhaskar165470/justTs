import { useEffect, useState } from 'react'
import {
  Typography,
  Container,
  Box,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material'
import { InputField } from '../../components/form'
import { PrimaryButton, SecondaryButton } from '../../components/buttons'
import { useValidate, type ValidationErrors } from '../../components/hooks'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setAccountsPayableField,
  setActiveTab,
  setBillingField,
  setSameAsMspDetails,
  type BillingValues,
  type AccountsPayableValues
} from '../../store/mspWizardSlice'
import { FORM_FIELDS } from '../config'

interface BillingProps {
  onNext?: () => void
}

type BillingAddressFieldKey = 'address1' | 'address2' | 'country' | 'state' | 'city' | 'zip'
type AccountsPayableFieldKey = keyof AccountsPayableValues

interface BillingAddressField {
  key: BillingAddressFieldKey
  label: string
  md?: number
}

interface AccountsPayableField {
  key: AccountsPayableFieldKey
  label: string
  md?: number
  type?: 'text' | 'email' | 'number' | 'tel'
}

const FORM_FIELD_LABELS_BY_KEY: Record<string, string> = FORM_FIELDS.reduce<Record<string, string>>(
  (acc, field) => {
    acc[field.key] = field.label
    return acc
  },
  {}
)

const formatFieldLabel = (label: string): string => label.replace(/([A-Za-z])(\d)/g, '$1 $2')

const getFieldLabel = (key: string, fallback: string): string => {
  const mappedLabel = FORM_FIELD_LABELS_BY_KEY[key]
  if (!mappedLabel) return fallback
  return formatFieldLabel(mappedLabel)
}

const BILLING_ADDRESS_FIELD_KEYS: BillingAddressFieldKey[] = ['address1', 'address2', 'country', 'state', 'city', 'zip']

const BILLING_ADDRESS_FIELDS: BillingAddressField[] = BILLING_ADDRESS_FIELD_KEYS.map((key) => ({
  key,
  label: getFieldLabel(key, key),
  md: key === 'country' || key === 'state' || key === 'city' || key === 'zip' ? 6 : 12
}))

const ACCOUNTS_PAYABLE_FIELDS: AccountsPayableField[] = [
  { key: 'name', label: getFieldLabel('name', 'name'), md: 6 },
  { key: 'phone', label: 'phone', md: 6, type: 'tel' },
  { key: 'fax', label: getFieldLabel('fax', 'fax'), md: 6 },
  { key: 'email', label: getFieldLabel('email', 'email'), md: 6, type: 'email' }
]

const formatCountryCodePhone = (input: string): string => {
  const raw = input.replace(/[^\d+]/g, '')
  const hasPlus = raw.startsWith('+')
  const digits = raw.replace(/\D/g, '').slice(0, 13)
  if (!digits) return ''
  return `${hasPlus ? '+' : '+'}${digits}`
}

const formatZip = (input: string): string => input.replace(/\D/g, '').slice(0, 6)

const PHONE_PATTERN = /^\+\d{1,13}$/
const ZIP_PATTERN = /^\d{6}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const Billing: React.FC<BillingProps> = ({ onNext }) => {
  const dispatch = useAppDispatch()
  const sameAsMspDetails = useAppSelector((state) => state.mspWizard.sameAsMspDetails)
  const billingValues = useAppSelector((state) => state.mspWizard.billingValues)
  const accountsPayableValues = useAppSelector((state) => state.mspWizard.accountsPayableValues)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const validationValues = { ...billingValues, ...accountsPayableValues }
  const validateBilling = (values: typeof validationValues): ValidationErrors<typeof validationValues> => {
    const errors: ValidationErrors<typeof validationValues> = {}

    if (!values.billTo) errors.billTo = 'bill to is required'
    if (!values.address1) errors.address1 = 'address1 is required'
    if (!values.country) errors.country = 'country is required'
    if (!values.state) errors.state = 'state is required'
    if (!values.city) errors.city = 'city is required'
    if (!values.zip) errors.zip = 'zip is required'
    if (values.zip && !ZIP_PATTERN.test(values.zip)) errors.zip = 'zip must be 6 digits'

    if (!values.name) errors.name = 'name is required'
    if (!values.phone) errors.phone = 'phone is required'
    if (values.phone && !PHONE_PATTERN.test(values.phone)) errors.phone = 'phone must be in +countrycode format'
    if (!values.email) errors.email = 'email is required'
    if (values.email && !EMAIL_PATTERN.test(values.email)) errors.email = 'email is invalid'

    return errors
  }
  const { errors, validate } = useValidate(validationValues, validateBilling)

  useEffect(() => {
    if (submitAttempted) {
      validate()
    }
  }, [billingValues, accountsPayableValues, submitAttempted, validate])

  const handleFieldChange = (field: keyof BillingValues, value: string) => {
    const nextValue = field === 'zip' ? formatZip(value) : value
    dispatch(setBillingField({ field, value: nextValue }))
  }

  const handleAccountsPayableFieldChange = (field: keyof AccountsPayableValues, value: string) => {
    const nextValue = field === 'phone' ? formatCountryCodePhone(value) : value
    dispatch(setAccountsPayableField({ field, value: nextValue }))
  }

  const handleNextClick = () => {
    setSubmitAttempted(true)
    if (validate()) {
      onNext?.()
    }
  }

  const fieldErrors = submitAttempted ? errors : {}

  return (
    <Container>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
          billing information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={sameAsMspDetails}
              onChange={(event) => dispatch(setSameAsMspDetails(event.target.checked))}
            />
          }
          label="same as msp details"
          sx={{ mb: 2 }}
        />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputField
              label="bill to"
              value={billingValues.billTo}
              error={Boolean(fieldErrors.billTo)}
              helperText={fieldErrors.billTo}
              onChange={(value) => handleFieldChange('billTo', value)}
            />
          </Grid>
          {BILLING_ADDRESS_FIELDS.map((field) => (
            <Grid item xs={12} md={field.md ?? 12} key={field.key}>
              <InputField
                label={field.label}
                value={billingValues[field.key]}
                error={Boolean(fieldErrors[field.key])}
                helperText={fieldErrors[field.key]}
                onChange={(value) => handleFieldChange(field.key, value)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
          a/c payable info
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {ACCOUNTS_PAYABLE_FIELDS.map((field) => (
            <Grid item xs={12} md={field.md ?? 12} key={field.key}>
              <InputField
                label={field.label}
                {...(field.type ? { type: field.type } : {})}
                value={accountsPayableValues[field.key]}
                error={Boolean(fieldErrors[field.key])}
                helperText={fieldErrors[field.key]}
                onChange={(value) => handleAccountsPayableFieldChange(field.key, value)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <PrimaryButton onClick={() => dispatch(setActiveTab('details'))}>back</PrimaryButton>
        <SecondaryButton onClick={handleNextClick}>next</SecondaryButton>
      </Box>
    </Container>
  )
}

export default Billing
