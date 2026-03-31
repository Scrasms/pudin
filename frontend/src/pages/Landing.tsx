import { Box, Container, Typography } from '@mui/material';

function Landing() {
  return (
    <>
      <Container>
        <Box sx={{ textAlign: 'center', color: 'secondary.dark' }}>
          <Typography variant="h1">Hello!</Typography>
        </Box>
      </Container>
    </>
  );
}

export default Landing;
