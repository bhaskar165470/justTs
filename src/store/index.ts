import { combineReducers, configureStore } from '@reduxjs/toolkit'
import mspWizardReducer from './mspWizardSlice'

export const rootReducer = combineReducers({
  mspWizard: mspWizardReducer
})

export const setupStore = () =>
  configureStore({
    reducer: rootReducer
  })

export const store = setupStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
