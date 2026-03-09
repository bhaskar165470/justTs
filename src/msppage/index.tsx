import { useState, type SyntheticEvent } from 'react'
import { Container, Typography, Box, Tabs, Tab } from '@mui/material'
import MspDetails from './MspDetails'
import Billing from './billingmsp/billing'
import { billingMspPageStyles } from './billingmsp/index.styles'
import type { FormValues, ActiveTab, BillingValues, AccountsPayableValues } from './types'

const BILLING_INITIAL_VALUES: BillingValues = {
  billTo: '',
  address1: '',
  address2: '',
  country: '',
  state: '',
  city: '',
  zip: ''
}

const ACCOUNTS_PAYABLE_INITIAL_VALUES: AccountsPayableValues = {
  name: '',
  phone: '',
  fax: '',
  email: ''
}

// Copy only fields that overlap between "details" and "billing" sections.
const mapFormToBilling = (values: FormValues): BillingValues => ({
  billTo: values.company || values.name || '',
  address1: values.address1 || '',
  address2: values.address2 || '',
  country: values.country || '',
  state: values.state || '',
  city: values.city || '',
  zip: values.zip || ''
})

const detailsRequiredFieldsComplete = (values: FormValues): boolean =>
  ['company', 'name', 'country', 'state', 'city', 'zip'].every((key) => Boolean(values[key]?.trim()))

const BillingMspPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('details')
  const [mspDetailsValues, setMspDetailsValuesState] = useState<FormValues>({})
  const [sameAsMspDetails, setSameAsMspDetailsState] = useState(false)
  const [billingValues, setBillingValues] = useState<BillingValues>(BILLING_INITIAL_VALUES)
  const [submitting, setSubmitting] = useState(false)
  const [accountsPayableValues, setAccountsPayableValues] = useState<AccountsPayableValues>(
    ACCOUNTS_PAYABLE_INITIAL_VALUES
  )

  const setMspDetailsValues = (values: FormValues) => {
    setMspDetailsValuesState(values)
    // Keep billing in sync only when the "same as" option is active.
    if (sameAsMspDetails) {
      setBillingValues(mapFormToBilling(values))
    }
  }

  const setSameAsMspDetails = (same: boolean) => {
    setSameAsMspDetailsState(same)
    if (same) {
      // Snapshot current details into billing when user enables the toggle.
      setBillingValues(mapFormToBilling(mspDetailsValues))
    }
  }

  const setBillingField = (field: keyof BillingValues, value: string) => {
    setBillingValues((prev) => ({ ...prev, [field]: value }))
  }

  const setAccountsPayableField = (field: keyof AccountsPayableValues, value: string) => {
    setAccountsPayableValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitMsp = async () => {
    setSubmitting(true)
    // UI-only flow: no backend submit in this project.
    try {
      window.alert('UI flow complete. Backend submit is disabled here.')
    } finally {
      setSubmitting(false)
    }
  }
  const canOpenBilling = detailsRequiredFieldsComplete(mspDetailsValues)
  const handleTabChange = (_event: SyntheticEvent, value: ActiveTab) => {
    // Guard billing tab until required details are present.
    if (value === 'billing' && !canOpenBilling) return
    setActiveTab(value)
  }

  return (
    <Container maxWidth="lg" sx={billingMspPageStyles.container}>
      <Box sx={billingMspPageStyles.header}>
        <Typography variant="h6" sx={{ ...billingMspPageStyles.headerTitle, textTransform: 'capitalize' }}>
          vendor information
        </Typography>
      </Box>

      <Box sx={billingMspPageStyles.tabsRow}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="details" value="details" />
          <Tab label="billing" value="billing" disabled={!canOpenBilling} />
        </Tabs>
      </Box>

      {activeTab === 'details' && (
        <MspDetails
          formValues={mspDetailsValues}
          setMspDetailsValues={setMspDetailsValues}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === 'billing' && (
        <Billing
          sameAsMspDetails={sameAsMspDetails}
          billingValues={billingValues}
          accountsPayableValues={accountsPayableValues}
          setSameAsMspDetails={setSameAsMspDetails}
          setBillingField={setBillingField}
          setAccountsPayableField={setAccountsPayableField}
          setActiveTab={setActiveTab}
          onSave={handleSubmitMsp}
          submitting={submitting}
        />
      )}
    </Container>
  )
}

export default BillingMspPage
