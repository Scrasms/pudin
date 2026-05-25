import { useNavigate } from 'react-router';
import MainLayout from '../components/Layouts/MainLayout';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <MainLayout showStyle>
        <Box sx={{ mt: '15%' }}>
          <Typography
            variant="h1"
            sx={{
              display: 'inline',
              color: 'hsl(0, 60%, 65%)',
              textAlign: 'left',
              mr: 'auto',
            }}
          >
            Read,{' '}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              display: 'inline',
              color: 'hsl(212, 40%, 65%)',
              textAlign: 'left',
              mr: 'auto',
            }}
          >
            Write,{' '}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              display: 'inline',
              color: 'hsl(120, 30%, 65%)',
              textAlign: 'left',
              mr: 'auto',
            }}
          >
            Plan...
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: 'secondary.main',
              textAlign: 'right',
              ml: 'auto',
              fontWeight: 'bold',
            }}
          >
            with Pudin
          </Typography>

          <ButtonGroup
            variant="contained"
            size="large"
            color="secondary"
            aria-label="login and register button group"
            disableElevation
            sx={{ display: 'flex', justifyContent: 'center', mt: '5%' }}
          >
            <Button
              sx={{ fontSize: '1.2rem' }}
              onClick={() => navigate('register')}
            >
              Get Started
            </Button>
            <Button
              sx={{ fontSize: '1.2rem' }}
              onClick={() => navigate('login')}
            >
              Login
            </Button>
          </ButtonGroup>
        </Box>
      </MainLayout>
    </>
  );
};

export default Landing;
