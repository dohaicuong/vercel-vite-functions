import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import { SnackbarProvider } from 'notistack'

export const theme = createTheme({
  palette: { mode: 'dark' }
})

type ThemeProviderProps = {
  children?: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        {children}
      </SnackbarProvider>
    </MuiThemeProvider>
  )
}
