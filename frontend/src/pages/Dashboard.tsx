import { Container } from '@mui/material';
import MainLayout from '../components/Layouts/MainLayout';
import Shelf from '../components/Shelf/Shelf';
import { useEffect, useState } from 'react';
import { apiCall } from '../utils/api';

const Dashboard = () => {
  const [books, setBooks] = useState([]);

  const refreshBooks = async () => {
    const data = await apiCall('book', 'GET');
    console.log(data);
    setBooks(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshBooks();
  }, []);

  return (
    <>
      <MainLayout>
        <Container sx={{ display: 'flex', justifyContent: 'center' }}>
          <Shelf books={books} />
        </Container>
      </MainLayout>
    </>
  );
};

export default Dashboard;
