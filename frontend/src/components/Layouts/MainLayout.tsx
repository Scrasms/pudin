import { useContext, type ReactNode } from 'react';
import Header from '../Header';
import {
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import pudin from '../../assets/pudin.svg';
import { UserContext } from '../../contexts/UserContext';

/**
 * Basic layout containing a header with the rest of page content centred vertically in a column
 * to be used by authenticated routes
 */
const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Stack sx={{ height: '100dvh', width: '100dvw', overflowY: 'auto' }}>
        <Header>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              component="img"
              src={pudin}
              sx={{ height: '60px', width: '60px' }}
            />
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Button>Write</Button>
            {user?.image ? (
              <Avatar
                src={user?.image}
                alt={`${user?.username}'s profile picture`}
              />
            ) : (
              <Avatar>{user?.username?.at(0)?.toUpperCase()}</Avatar>
            )}
          </Stack>
        </Header>

        <Container
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: 2,
            mt: 4
          }}
        >
          <Typography variant="h4" sx={{ color: 'secondary.text' }}>
            Welcome {user?.username}!
          </Typography>

          {children}
        </Container>
      </Stack>
    </>
  );
};

export default MainLayout;
