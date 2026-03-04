import Button, { type ButtonProps } from '@mui/material/Button'

const PrimaryButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button variant="contained" color="primary" {...props}>
      {children}
    </Button>
  )
}

export default PrimaryButton
