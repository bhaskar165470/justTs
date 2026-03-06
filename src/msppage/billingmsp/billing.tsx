import { useEffect, useState } from 'react'
import {
  Typography,
  Container,
  Box,
  Paper,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material'
import { InputField } from '../../components/form'
import { PrimaryButton, SecondaryButton } from '../../components/buttons'
import { useValidate, type ValidationErrors } from '../../components/hooks'
import {
  type ActiveTab,
  type BillingValues,
  type AccountsPayableValues
} from '../types'
import { ACCOUNTS_PAYABLE_FIELDS, BILLING_ADDRESS_FIELDS } from '../config'

interface BillingProps {
  sameAsMspDetails: boolean
  billingValues: BillingValues
  accountsPayableValues: AccountsPayableValues
  setSameAsMspDetails: (same: boolean) => void
  setBillingField: (field: keyof BillingValues, value: string) => void
  setAccountsPayableField: (field: keyof AccountsPayableValues, value: string) => void
  setActiveTab: (tab: ActiveTab) => void
  onNext?: () => void
}

type BillingAddressFieldKey = 'address1' | 'address2' | 'country' | 'state' | 'city' | 'zip'

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

const Billing: React.FC<BillingProps> = ({
  sameAsMspDetails,
  billingValues,
  accountsPayableValues,
  setSameAsMspDetails,
  setBillingField,
  setAccountsPayableField,
  setActiveTab,
  onNext
}) => {
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
    setBillingField(field, nextValue)
  }

  const handleAccountsPayableFieldChange = (field: keyof AccountsPayableValues, value: string) => {
    const nextValue = field === 'phone' ? formatCountryCodePhone(value) : value
    setAccountsPayableField(field, nextValue)
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
              onChange={(event) => setSameAsMspDetails(event.target.checked)}
            />
          }
          label="same as msp details"
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ width: '100%' }}>
            <InputField
              label="bill to"
              value={billingValues.billTo}
              error={Boolean(fieldErrors.billTo)}
              helperText={fieldErrors.billTo}
              onChange={(value) => handleFieldChange('billTo', value)}
            />
          </Box>
          {BILLING_ADDRESS_FIELDS.map((field) => (
            <Box
              key={field.key}
              sx={{ width: { xs: '100%', md: field.isHalfWidth ? 'calc(50% - 8px)' : '100%' } }}
            >
              <InputField
                label={field.label}
                value={billingValues[field.key as BillingAddressFieldKey]}
                error={Boolean(fieldErrors[field.key as keyof typeof fieldErrors])}
                helperText={fieldErrors[field.key as keyof typeof fieldErrors]}
                onChange={(value) => handleFieldChange(field.key as BillingAddressFieldKey, value)}
              />
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
          a/c payable info
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {ACCOUNTS_PAYABLE_FIELDS.map((field) => (
            <Box
              key={field.key}
              sx={{ width: { xs: '100%', md: field.isHalfWidth ? 'calc(50% - 8px)' : '100%' } }}
            >
              <InputField
                label={field.label}
                {...(field.type ? { type: field.type } : {})}
                value={accountsPayableValues[field.key]}
                error={Boolean(fieldErrors[field.key as keyof typeof fieldErrors])}
                helperText={fieldErrors[field.key as keyof typeof fieldErrors]}
                onChange={(value) => handleAccountsPayableFieldChange(field.key, value)}
              />
            </Box>
          ))}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <PrimaryButton onClick={() => setActiveTab('details')}>back</PrimaryButton>
        <SecondaryButton onClick={handleNextClick}>next</SecondaryButton>
      </Box>
    </Container>
  )
}

export default Billing
