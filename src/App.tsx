import { Routes, Route } from 'react-router-dom'
import BillingMspPage from './msppage'
import EnterInfoPage from './enterinfopage'

const App: React.FC = () => {
  // Keep route definitions in one place so page-level navigation is easy to scan.
  return (
    <Routes>
      <Route path="/" element={<EnterInfoPage />} />
      <Route path="/msp" element={<BillingMspPage />} />
      <Route path="/enter-info" element={<EnterInfoPage />} />
    </Routes>
  )
}

export default App
