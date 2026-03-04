import Button, { type ButtonProps } from '@mui/material/Button'

const SecondaryButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button variant="outlined" color="secondary" {...props}>
      {children}
    </Button>
  )
}

export default SecondaryButton
