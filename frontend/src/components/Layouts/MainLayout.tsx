import { useContext, type ReactNode } from 'react';
import Header from '../Header';
import { Box, Button, Container, Stack } from '@mui/material';
import pudin from '../../assets/pudin.svg';
import { UserContext } from '../../contexts/UserContext';
import SearchBar from '../SearchBar';
import UserAvatar from '../UserAvatar';
import { useNavigate } from 'react-router';

/**
 * Basic layout containing a header with the rest of page content centred vertically in a column
 * to be used by authenticated routes
 */
const MainLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <Stack sx={{ height: '100dvh', width: '100dvw', overflowY: 'auto' }}>
        <Header>
          <Box
            component="img"
            src={pudin}
            sx={{ height: '60px', width: '60px', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          />

          <SearchBar />

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Button>Write</Button>
            {user && <UserAvatar username={user.username} image={user.image} />}
          </Stack>
        </Header>

        <Container
          disableGutters
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: 2,
            mt: 4,
          }}
        >
          {children}
        </Container>
      </Stack>
    </>
  );
};

export default MainLayout;
