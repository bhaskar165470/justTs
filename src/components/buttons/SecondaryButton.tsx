import Button, { type ButtonProps } from '@mui/material/Button'

const SecondaryButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  // Centralize secondary button defaults for consistent look-and-feel.
  return (
    <Button variant="outlined" color="info" sx={{ textTransform: 'capitalize' }} {...props}>
      {children}
    </Button>
  )
}

export default SecondaryButton
