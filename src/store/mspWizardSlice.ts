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
  mspDetailsValues: FormValues
  sameAsMspDetails: boolean
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

const setFieldValue = (
  target: Record<string, string>,
  payload: { field: string; value: string }
) => {
  target[payload.field] = payload.value
}

const initialState: MspWizardState = {
  activeTab: 'details',
  mspDetailsValues: {},
  sameAsMspDetails: false,
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
    setMspDetailsValues: (state, action: PayloadAction<FormValues>) => {
      state.mspDetailsValues = action.payload
      if (state.sameAsMspDetails) {
        state.billingValues = mapFormToBilling(action.payload)
      }
    },
    setSameAsMspDetails: (state, action: PayloadAction<boolean>) => {
      state.sameAsMspDetails = action.payload
      if (action.payload) {
        state.billingValues = mapFormToBilling(state.mspDetailsValues)
      }
    },
    setBillingField: (
      state,
      action: PayloadAction<{ field: keyof BillingValues; value: string }>
    ) => {
      setFieldValue(state.billingValues, {
        field: action.payload.field,
        value: action.payload.value
      })
    },
    setAccountsPayableField: (
      state,
      action: PayloadAction<{ field: keyof AccountsPayableValues; value: string }>
    ) => {
      setFieldValue(state.accountsPayableValues, {
        field: action.payload.field,
        value: action.payload.value
      })
    }
  }
})

export const mspWizardActions = mspWizardSlice.actions

export const {
  setActiveTab,
  setMspDetailsValues,
  setSameAsMspDetails,
  setBillingField,
  setAccountsPayableField
} = mspWizardActions

export default mspWizardSlice.reducer
