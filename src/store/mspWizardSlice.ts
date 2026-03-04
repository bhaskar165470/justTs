import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { FormValues } from '../msppage/types'

type ActiveTab = 'details' | 'billing'

export interface BillingValues {
  billTo: string
  address1: string
  address2: string
  country: string
  state: string
  city: string
  zip: string
}

export interface AccountsPayableValues {
  name: string
  phone: string
  fax: string
  email: string
}

export interface MspWizardState {
  activeTab: ActiveTab
  formValues: FormValues
  sameAsFormPanel: boolean
  billingValues: BillingValues
  accountsPayableValues: AccountsPayableValues
}

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

const initialState: MspWizardState = {
  activeTab: 'details',
  formValues: {},
  sameAsFormPanel: false,
  billingValues: BILLING_INITIAL_VALUES,
  accountsPayableValues: ACCOUNTS_PAYABLE_INITIAL_VALUES
}

const mspWizardSlice = createSlice({
  name: 'mspWizard',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload
    },
    setFormValues: (state, action: PayloadAction<FormValues>) => {
      state.formValues = action.payload
      if (state.sameAsFormPanel) {
        state.billingValues = mapFormToBilling(action.payload)
      }
    },
    setSameAsFormPanel: (state, action: PayloadAction<boolean>) => {
      state.sameAsFormPanel = action.payload
      if (action.payload) {
        state.billingValues = mapFormToBilling(state.formValues)
      }
    },
    setBillingField: (
      state,
      action: PayloadAction<{ field: keyof BillingValues; value: string }>
    ) => {
      state.billingValues[action.payload.field] = action.payload.value
    },
    setAccountsPayableField: (
      state,
      action: PayloadAction<{ field: keyof AccountsPayableValues; value: string }>
    ) => {
      state.accountsPayableValues[action.payload.field] = action.payload.value
    }
  }
})

export const {
  setActiveTab,
  setFormValues,
  setSameAsFormPanel,
  setBillingField,
  setAccountsPayableField
} = mspWizardSlice.actions

export default mspWizardSlice.reducer
