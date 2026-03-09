import { useCallback, useEffect, useState } from 'react'
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
import {
  type ActiveTab,
  type BillingValues,
  type AccountsPayableValues
} from '../types'
import { ACCOUNTS_PAYABLE_FIELDS, BILLING_ADDRESS_FIELDS } from '../config'
import { COUNTRY_CODE_PHONE_PATTERN } from '../../utils/patterns'
import { formatCountryCodePhone, formatZip } from '../../utils/inputFormat'

interface BillingProps {
  sameAsMspDetails: boolean
  billingValues: BillingValues
  accountsPayableValues: AccountsPayableValues
  setSameAsMspDetails: (same: boolean) => void
  setBillingField: (field: keyof BillingValues, value: string) => void
  setAccountsPayableField: (field: keyof AccountsPayableValues, value: string) => void
  setActiveTab: (tab: ActiveTab) => void
  onSave?: () => Promise<void> | void
  submitting?: boolean
}

type BillingAddressFieldKey = 'address1' | 'address2' | 'country' | 'state' | 'city' | 'zip'

const ZIP_PATTERN = /^\d{6}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
type ValidationValues = BillingValues & AccountsPayableValues
type ValidationErrors = Partial<Record<keyof ValidationValues, string>>

const validateBilling = (values: ValidationValues): ValidationErrors => {
  // Validation is centralized so both render-time and submit-time checks match.
  const errors: ValidationErrors = {}

  if (!values.billTo) errors.billTo = 'bill to is required'
  if (!values.address1) errors.address1 = 'address1 is required'
  if (!values.country) errors.country = 'country is required'
  if (!values.state) errors.state = 'state is required'
  if (!values.city) errors.city = 'city is required'
  if (!values.zip) errors.zip = 'zip is required'
  if (values.zip && !ZIP_PATTERN.test(values.zip)) errors.zip = 'zip must be 6 digits'

  if (!values.name) errors.name = 'name is required'
  if (!values.phone) errors.phone = 'phone is required'
  if (values.phone && !COUNTRY_CODE_PHONE_PATTERN.test(values.phone)) errors.phone = 'phone must be in +countrycode format'
  if (!values.email) errors.email = 'email is required'
  if (values.email && !EMAIL_PATTERN.test(values.email)) errors.email = 'email is invalid'

  return errors
}

const Billing: React.FC<BillingProps> = ({
  sameAsMspDetails,
  billingValues,
  accountsPayableValues,
  setSameAsMspDetails,
  setBillingField,
  setAccountsPayableField,
  setActiveTab,
  onSave,
  submitting = false
}) => {
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validationValues: ValidationValues = { ...billingValues, ...accountsPayableValues }
  const validate = useCallback((values: ValidationValues = validationValues): boolean => {
    const nextErrors = validateBilling(values)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [validationValues])

  useEffect(() => {
    if (submitAttempted) {
      validate()
    }
  }, [billingValues, accountsPayableValues, submitAttempted, validate])

  const handleFieldChange = (field: keyof BillingValues, value: string) => {
    // Enforce numeric zip input at the edge of state updates.
    const nextValue = field === 'zip' ? formatZip(value) : value
    setBillingField(field, nextValue)
  }

  const handleAccountsPayableFieldChange = (field: keyof AccountsPayableValues, value: string) => {
    // Keep phone values in a backend-friendly canonical format.
    const nextValue = field === 'phone' ? formatCountryCodePhone(value) : value
    setAccountsPayableField(field, nextValue)
  }

  const handleSaveClick = async () => {
    setSubmitAttempted(true)
    if (validate()) {
      await onSave?.()
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
        <SecondaryButton disabled={submitting} onClick={() => setActiveTab('details')}>
          prev
        </SecondaryButton>
        <PrimaryButton disabled={submitting} onClick={handleSaveClick}>
          {submitting ? 'saving...' : 'save'}
        </PrimaryButton>
      </Box>
    </Container>
  )
}

export default Billing
