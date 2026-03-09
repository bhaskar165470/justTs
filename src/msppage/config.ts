import type { FieldDefinition } from './types'

const toFieldKey = (label: string): string => label.replace(/\s+/g, '_').toLowerCase()

// Single source of truth for the details form field order.
export const FORM_FIELD_LABELS = [
    'company',
    'name',
    'contact',
    'title',
    'email',
    'address1',
    'address2',
    'country',
    'state',
    'city',
    'zip',
    'phone-office',
    'phone-home',
    'cell',
    'fax',
    'website',
    'status',
    'purpose'
]

export const FORM_FIELDS: FieldDefinition[] = FORM_FIELD_LABELS.map((label) => {
    // Field type controls which form widget gets rendered.
    if (label === 'company') return { label, key: toFieldKey(label), type: 'company' }
    if (label === 'country') return { label, key: toFieldKey(label), type: 'country' }
    if (label === 'state') return { label, key: toFieldKey(label), type: 'state' }
    if (label === 'city') return { label, key: toFieldKey(label), type: 'city' }
    if (label.toLowerCase() === 'status') return { label, key: toFieldKey(label), type: 'status' }
    if (label === 'purpose') return { label, key: toFieldKey(label), type: 'purpose' }
    return { label, key: toFieldKey(label), type: 'text' }
})

interface BillingAddressFieldDefinition {
    key: 'address1' | 'address2' | 'country' | 'state' | 'city' | 'zip'
    label: string
    isHalfWidth?: boolean
}

interface AccountsPayableFieldDefinition {
    key: 'name' | 'phone' | 'fax' | 'email'
    label: string
    isHalfWidth?: boolean
    type?: 'text' | 'email' | 'number' | 'tel'
}

const FORM_FIELD_LABELS_BY_KEY: Record<string, string> = FORM_FIELDS.reduce<Record<string, string>>(
    (acc, field) => {
        acc[field.key] = field.label
        return acc
    },
    {}
)

// Convert labels like "address1" to "address 1" for display-only text.
const formatFieldLabel = (label: string): string => label.replace(/([A-Za-z])(\d)/g, '$1 $2')

const getFieldLabel = (key: string, fallback: string): string => {
    const mappedLabel = FORM_FIELD_LABELS_BY_KEY[key]
    if (!mappedLabel) return fallback
    return formatFieldLabel(mappedLabel)
}

const BILLING_ADDRESS_FIELD_KEYS: BillingAddressFieldDefinition['key'][] = [
    'address1',
    'address2',
    'country',
    'state',
    'city',
    'zip'
]

export const BILLING_ADDRESS_FIELDS: BillingAddressFieldDefinition[] = BILLING_ADDRESS_FIELD_KEYS.map(
    (key) => ({
        key,
        label: getFieldLabel(key, key),
        isHalfWidth: key === 'country' || key === 'state' || key === 'city' || key === 'zip'
    })
)

export const ACCOUNTS_PAYABLE_FIELDS: AccountsPayableFieldDefinition[] = [
    { key: 'name', label: getFieldLabel('name', 'name'), isHalfWidth: true },
    { key: 'phone', label: 'phone', isHalfWidth: true, type: 'tel' },
    { key: 'fax', label: getFieldLabel('fax', 'fax'), isHalfWidth: true },
    { key: 'email', label: getFieldLabel('email', 'email'), isHalfWidth: true, type: 'email' }
]

export const splitFieldsInHalf = (fields: FieldDefinition[]): [FieldDefinition[], FieldDefinition[]] => {
    // Keep left column one item larger when there is an odd field count.
    const half = Math.ceil(fields.length / 2)
    return [fields.slice(0, half), fields.slice(half)]
}
