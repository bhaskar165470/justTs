import TextField from '@mui/material/TextField'

interface InputFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  type?: 'text' | 'email' | 'number' | 'tel'
  error?: boolean
  helperText?: string | undefined
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  type = 'text',
  error = false,
  helperText
}) => {
  // Thin wrapper around MUI TextField to standardize sizing/props across forms.
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      type={type}
      value={value}
      disabled={disabled}
      error={error}
      helperText={helperText}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default InputField
