import { Container, Typography, Box, Button } from '@mui/material'
import MspDetails from '../MspDetails'
import Billing from './billing'
import { billingMspPageStyles } from './index.styles'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { mspWizardActions } from '../../store/mspWizardSlice'
import { selectActiveTab } from '../../store/mspWizardSelectors'

const BillingMspPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeTab = useAppSelector(selectActiveTab)

  return (
    <Container maxWidth="md" sx={billingMspPageStyles.container}>
      
      {/* Header */}
      <Box sx={billingMspPageStyles.header}>
        <Typography variant="h6" sx={{ ...billingMspPageStyles.headerTitle, textTransform: 'capitalize' }}>
          vendor information
        </Typography>
      </Box>

      {/* Horizontal Buttons */}
      <Box sx={billingMspPageStyles.tabsRow}>
        <Button
          variant={activeTab === 'details' ? 'contained' : 'outlined'}
          sx={{ textTransform: 'capitalize' }}
          onClick={() => dispatch(mspWizardActions.setActiveTab('details'))}
        >
          details
        </Button>

        <Button
          variant={activeTab === 'billing' ? 'contained' : 'outlined'}
          sx={{ textTransform: 'capitalize' }}
          onClick={() => dispatch(mspWizardActions.setActiveTab('billing'))}
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

export default BillingMspPage
