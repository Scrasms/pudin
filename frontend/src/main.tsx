import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material';
import App from './App.tsx';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

declare module '@mui/material/styles' {
  interface PaletteColor {
    text?: string;
  }
  interface SimplePaletteColorOptions {
    text?: string;
  }
}

let theme = createTheme({
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
      text: 'hsl(9, 32%, 20%)',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'Helvetica', 'sans-serif'].join(
      ',',
    ),
  },
});

theme = responsiveFontSizes(theme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
