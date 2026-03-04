import { configureStore } from '@reduxjs/toolkit'
import mspWizardReducer from './mspWizardSlice'

export const store = configureStore({
  reducer: {
    mspWizard: mspWizardReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

