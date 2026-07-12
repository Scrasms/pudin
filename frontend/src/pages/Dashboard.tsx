import { Container, Typography } from '@mui/material';
import MainLayout from '../components/Layouts/MainLayout';
import Shelf from '../components/Shelf/Shelf';
import { useContext, useEffect, useState } from 'react';
import { apiCall } from '../utils/api';
import { UserContext } from '../contexts/UserContext';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [books, setBooks] = useState([]);

  const refreshBooks = async () => {
    const data = await apiCall('book', 'GET');
    setBooks(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshBooks();
  }, []);

  return (
    <>
      <MainLayout>
        <Typography variant="h4">Welcome {user?.username}!</Typography>
        <Container sx={{ display: 'flex', justifyContent: 'center' }}>
          <Shelf books={books} />
        </Container>
      </MainLayout>
    </>
  );
};

export default Dashboard;
