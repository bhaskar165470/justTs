import { Routes, Route } from 'react-router-dom'
import BillingMspPage from './msppage/billingmsp'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BillingMspPage />} />
    </Routes>
  )
}

export default App
