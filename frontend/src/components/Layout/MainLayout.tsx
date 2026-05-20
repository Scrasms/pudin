import type { ReactNode } from 'react';
import Header from '../Header';
import Box from '@mui/material/Box';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box>
        <Header />
        {children}
      </Box>
    </>
  );
}
