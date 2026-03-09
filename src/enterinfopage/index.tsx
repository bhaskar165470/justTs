import { useState } from 'react'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { FormSection, InputField } from '../components/form'
import { PrimaryButton } from '../components/buttons'
import { FORM_FIELDS } from '../msppage/config'
import type { FieldDefinition, FormValues } from '../msppage/types'
import { useLocationOptions } from '../services/useLocationOptions'

type ExtraValues = {
  accountNumber: string
  billingAddress: string
  postCode: string
}

const INITIAL_EXTRA_VALUES: ExtraValues = {
  accountNumber: '',
  billingAddress: '',
  postCode: ''
}

// Reuse a subset of MSP fields so validation/format behavior stays consistent.
const REUSED_FIELD_KEYS = new Set(['company', 'name', 'email', 'phone-office'])
const REUSED_FIELDS: FieldDefinition[] = FORM_FIELDS.filter((field) => REUSED_FIELD_KEYS.has(field.key))

const EnterInfoPage: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({})
  const [extraValues, setExtraValues] = useState<ExtraValues>(INITIAL_EXTRA_VALUES)

  const { companies, loadingCompanies } = useLocationOptions({
    // This screen only needs company options from the shared hook.
    selectedCountry: '',
    selectedState: ''
  })

  const setExtraField = (field: keyof ExtraValues, value: string) => {
    setExtraValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // UI-only submit for now (no API integration on this screen).
    window.alert('Enter info saved (UI only).')
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
          enter info
        </Typography>

        <FormSection
          fields={REUSED_FIELDS}
          formValues={formValues}
          companies={companies}
          loadingCompanies={loadingCompanies}
          onChange={(name, value) => setFormValues((prev) => ({ ...prev, [name]: value }))}
        />

        <Stack spacing={2}>
          <InputField
            label="account number"
            value={extraValues.accountNumber}
            onChange={(value) => setExtraField('accountNumber', value)}
          />
          <InputField
            label="billing address"
            value={extraValues.billingAddress}
            onChange={(value) => setExtraField('billingAddress', value)}
          />
          <InputField label="post code" value={extraValues.postCode} onChange={(value) => setExtraField('postCode', value)} />
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <PrimaryButton onClick={handleSubmit}>save</PrimaryButton>
        </Box>
      </Paper>
    </Container>
  )
}

export default EnterInfoPage
