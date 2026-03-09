import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

interface FormTextFieldProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  disabled?: boolean
  loading?: boolean
  error?: boolean
  helperText?: string | undefined
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  loading = false,
  error = false,
  helperText
}) => {
  // Standard select field used for company/country/state/city and similar lists.
  return (
    <TextField
      select
      fullWidth
      size="small"
      label={label}
      value={value}
      disabled={disabled || loading}
      error={error}
      helperText={helperText}
      onChange={(event) => onChange(event.target.value)}
    >
      <MenuItem value="">select {label}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default FormTextField
