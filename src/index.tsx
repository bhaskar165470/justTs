import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import App from './msppage/billingmsp'
import { store } from './store'
import theme from './theme'
import './styles.css'

// central entry point; future pages can be added under <Routes />
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<App />} />
            {/* <Route path="/other" element={<OtherPage />} /> */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
