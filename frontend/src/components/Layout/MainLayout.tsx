import type { ReactNode } from 'react';
import Header from '../Header';
import Box from '@mui/material/Box';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Box>
        <Header />
        {children}
      </Box>
    </>
  );
}

export default MainLayout;
