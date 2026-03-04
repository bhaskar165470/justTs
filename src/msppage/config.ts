import type { FieldDefinition } from './types'

const toFieldKey = (label: string): string => label.replace(/\s+/g, '_').toLowerCase()

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
    'reference'
]

export const FORM_FIELDS: FieldDefinition[] = FORM_FIELD_LABELS.map((label) => {
    if (label === 'company') return { label, key: toFieldKey(label), type: 'company' }
    if (label === 'country') return { label, key: toFieldKey(label), type: 'country' }
    if (label === 'state') return { label, key: toFieldKey(label), type: 'state' }
    if (label === 'city') return { label, key: toFieldKey(label), type: 'city' }
    if (label.toLowerCase() === 'status') return { label, key: toFieldKey(label), type: 'status' }
    if (label === 'reference') return { label, key: toFieldKey(label), type: 'reference' }
    return { label, key: toFieldKey(label), type: 'text' }
})

export const splitFieldsInHalf = (fields: FieldDefinition[]): [FieldDefinition[], FieldDefinition[]] => {
    const half = Math.ceil(fields.length / 2)
    return [fields.slice(0, half), fields.slice(half)]
}
