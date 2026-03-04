import { Container, Typography, Box, Button } from '@mui/material'
import MspDetails from '../MspDetails'
import Billing from './billing'
import { billingMspPageStyles } from './index.styles'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setActiveTab } from '../../store/mspWizardSlice'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeTab = useAppSelector((state) => state.mspWizard.activeTab)

  return (
    <Container maxWidth="md" sx={billingMspPageStyles.container}>
      
      {/* Header */}
      <Box sx={billingMspPageStyles.header}>
        <Typography variant="h6" sx={billingMspPageStyles.headerTitle}>
          vendor information
        </Typography>
      </Box>

      {/* Horizontal Buttons */}
      <Box sx={billingMspPageStyles.tabsRow}>
        <Button
          variant={activeTab === 'details' ? 'contained' : 'outlined'}
          onClick={() => dispatch(setActiveTab('details'))}
        >
          details
        </Button>

        <Button
          variant={activeTab === 'billing' ? 'contained' : 'outlined'}
          onClick={() => dispatch(setActiveTab('billing'))}
        >
          billing
        </Button>
      </Box>

      {/* Conditional Rendering */}
      {activeTab === 'details' && <MspDetails />}
      {activeTab === 'billing' && <Billing />}

    </Container>
  )
}

export default App
