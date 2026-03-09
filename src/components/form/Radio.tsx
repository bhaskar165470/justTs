import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

interface RadioOption {
  label: string
  value: string
}

interface RadioFieldProps {
  label: string
  value: string
  options: RadioOption[]
  onChange: (value: string) => void
  row?: boolean
  error?: boolean
  helperText?: string | undefined
}

const RadioField: React.FC<RadioFieldProps> = ({
  label,
  value,
  options,
  onChange,
  row = true,
  error = false,
  helperText
}) => {
  // Shared radio group wrapper with inline error rendering support.
  return (
    <FormControl error={error}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row={row} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <FormControlLabel key={option.value} value={option.value} control={<Radio size="small" />} label={option.label} />
        ))}
      </RadioGroup>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  )
}

export default RadioField
