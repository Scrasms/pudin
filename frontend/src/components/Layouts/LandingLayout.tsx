import type { ReactNode } from 'react';
import Header from '../Header';
import { Container, Stack } from '@mui/material';

/**
 * Layout containing a drip header for landing page
 */
const LandingLayout = ({
  children,
  showStyle,
}: {
  showStyle?: boolean;
  children: ReactNode;
}) => {
  return (
    <>
      <Stack sx={{ height: '100dvh', width: '100dvw', overflowY: 'auto' }}>
        <Header showStyle={showStyle} />

        <Container
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: showStyle ? 'flex-start' : 'center',
            alignItems: 'center',
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
