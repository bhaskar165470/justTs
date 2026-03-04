import type { RootState } from './index'

export const selectMspWizard = (state: RootState) => state.mspWizard
export const selectActiveTab = (state: RootState) => selectMspWizard(state).activeTab
export const selectMspDetailsValues = (state: RootState) => selectMspWizard(state).mspDetailsValues
export const selectSameAsMspDetails = (state: RootState) => selectMspWizard(state).sameAsMspDetails
export const selectBillingValues = (state: RootState) => selectMspWizard(state).billingValues
export const selectAccountsPayableValues = (state: RootState) =>
  selectMspWizard(state).accountsPayableValues
