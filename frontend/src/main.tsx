import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import App from './App.tsx';
import './index.css';

const theme = createTheme({
  palette: {
    background: {
      default: '#f9f7c3',
    },
    primary: {
      main: '#f9f7c3',
    },
    secondary: {
      main: '#a97d70',
      dark: '#83473a',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Arial',
      'Helvetica',
      'sans-serif'
    ].join(','),
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
