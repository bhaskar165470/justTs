import Button, { type ButtonProps } from '@mui/material/Button'

const PrimaryButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  // Centralize primary button defaults for consistent look-and-feel.
  return (
    <Button variant="contained" color="primary" sx={{ textTransform: 'capitalize' }} {...props}>
      {children}
    </Button>
  )
}

export default PrimaryButton
