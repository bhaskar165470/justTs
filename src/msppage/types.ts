export type FormValues = Record<string, string>

export type FieldType = 'text' | 'company' | 'country' | 'state' | 'city' | 'status' | 'purpose'

export interface FieldDefinition {
  label: string
  key: string
  type: FieldType
}

export type ActiveTab = 'details' | 'billing'

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
