import { Container, Grid } from '@mui/material';
import MainLayout from '../components/Layouts/MainLayout';

const Dashboard = () => {
  return (
    <>
      <MainLayout>
        <Container sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid container spacing={2}>
            <Grid size={8}>size=8</Grid>
            <Grid size={4}>size=4</Grid>
            <Grid size={4}>size=4</Grid>
            <Grid size={8}>size=8</Grid>
          </Grid>
        </Container>
      </MainLayout>
    </>
  );
};

export default Dashboard;
