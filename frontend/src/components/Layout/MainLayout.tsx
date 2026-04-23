import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Header from '../Header';

export default function MainLayout({ children }: { children?: ReactNode }) {
  return (
    <>
      <Box component="main">
        <Header />
        {children}
      </Box>
    </>
  );
}
