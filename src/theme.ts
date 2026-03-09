import { createTheme } from '@mui/material/styles'

// App-wide MUI theme overrides shared by all pages.
const theme = createTheme({
  palette: {
    text: { primary: '#000000' }
  },
  typography: {
    fontFamily: 'Poppins, sans-serif'
  },
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#7a95a8'
          },
          '&.Mui-selected': {
            backgroundColor: '#1296ee'
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#1296ee'
          }
        }
      }
    }
  }
})

export default theme
