import { useState } from 'react'
import { Container, Typography, Box } from '@mui/material'
import { PrimaryButton, SecondaryButton } from '../components/buttons'
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

const mapFormToBilling = (values: FormValues): BillingValues => ({
  billTo: values.company || values.name || '',
  address1: values.address1 || '',
  address2: values.address2 || '',
  country: values.country || '',
  state: values.state || '',
  city: values.city || '',
  zip: values.zip || ''
})

const BillingMspPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('details')
  const [mspDetailsValues, setMspDetailsValuesState] = useState<FormValues>({})
  const [sameAsMspDetails, setSameAsMspDetailsState] = useState(false)
  const [billingValues, setBillingValues] = useState<BillingValues>(BILLING_INITIAL_VALUES)
  const [accountsPayableValues, setAccountsPayableValues] = useState<AccountsPayableValues>(
    ACCOUNTS_PAYABLE_INITIAL_VALUES
  )

  const setMspDetailsValues = (values: FormValues) => {
    setMspDetailsValuesState(values)
    if (sameAsMspDetails) {
      setBillingValues(mapFormToBilling(values))
    }
  }

  const setSameAsMspDetails = (same: boolean) => {
    setSameAsMspDetailsState(same)
    if (same) {
      setBillingValues(mapFormToBilling(mspDetailsValues))
    }
  }

  const setBillingField = (field: keyof BillingValues, value: string) => {
    setBillingValues((prev) => ({ ...prev, [field]: value }))
  }

  const setAccountsPayableField = (field: keyof AccountsPayableValues, value: string) => {
    setAccountsPayableValues((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Container maxWidth="lg" sx={billingMspPageStyles.container}>
      <Box sx={billingMspPageStyles.header}>
        <Typography variant="h6" sx={{ ...billingMspPageStyles.headerTitle, textTransform: 'capitalize' }}>
          vendor information
        </Typography>
      </Box>

      <Box sx={billingMspPageStyles.tabsRow}>
        {activeTab === 'details' ? (
          <PrimaryButton onClick={() => setActiveTab('details')}>details</PrimaryButton>
        ) : (
          <SecondaryButton onClick={() => setActiveTab('details')}>details</SecondaryButton>
        )}

        {activeTab === 'billing' ? (
          <PrimaryButton onClick={() => setActiveTab('billing')}>billing</PrimaryButton>
        ) : (
          <SecondaryButton onClick={() => setActiveTab('billing')}>billing</SecondaryButton>
        )}
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
        />
      )}
    </Container>
  )
}

export default BillingMspPage
