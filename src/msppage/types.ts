export type FormValues = Record<string, string>

export type FieldType = 'text' | 'company' | 'country' | 'state' | 'city' | 'status' | 'purpose'

export interface FieldDefinition {
    label: string
    key: string
    type: FieldType
}
