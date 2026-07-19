import { useNavigate } from 'react-router';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import LandingLayout from '../components/Layouts/LandingLayout';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <LandingLayout showStyle>
        <Box>
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
            sx={{ display: 'flex', justifyContent: 'center', mt: '8%' }}
          >
            <Button
              sx={{ fontSize: '1.2rem' }}
              color="secondary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              sx={{ fontSize: '1.2rem' }}
              color="secondary"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </ButtonGroup>
        </Box>
      </LandingLayout>
    </>
  );
};

export default Landing;
