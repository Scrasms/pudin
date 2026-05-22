import type { ReactNode } from 'react';
import Header from '../Header';
import { Container, Stack } from '@mui/material';

/**
 * Layout for the Landing page, containing a stylised header with the
 * rest of page content centred vertically on the left half
 */
const LandingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Stack sx={{ height: '100dvh', width: '100dvw', overflowY: 'auto' }}>
        <Header showStyle />

        <Container
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: {
              xs: 'center',
              lg: 'flex-start',
            },
            zIndex: 1100,
          }}
        >
          {children}
        </Container>
      </Stack>
    </>
  );
};

export default LandingLayout;
