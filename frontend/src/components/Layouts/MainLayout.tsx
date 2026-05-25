import type { ReactNode } from 'react';
import Header from '../Header';
import { Container, Stack } from '@mui/material';

/**
 * Basic layout containing a header with the rest of page content centred vertically in a column
 */
const MainLayout = ({
  showStyle,
  children,
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
            justifyContent: 'center',
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

export default MainLayout;
