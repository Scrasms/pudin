import { Container, Pagination, Typography } from '@mui/material';
import MainLayout from '../components/Layouts/MainLayout';
import Shelf from '../components/Shelf/Shelf';
import { useEffect, useState, type ChangeEvent } from 'react';
import { apiCall } from '../utils/api';
import { useSearchParams } from 'react-router';

// TODO: give users sorting and filtering options, including altering limit
const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Clamp page number from searchParams up to 1
  let page = Number(searchParams.get('page'));
  if (page < 1 || isNaN(page)) {
    page = 1;
  }

  const [books, setBooks] = useState([]);
  const [limit] = useState(36);
  const [pageCount, setPageCount] = useState(1);

  const handlePageChange = (
    _event: ChangeEvent<unknown, Element>,
    page: number,
  ) => {
    setSearchParams({ page: page.toString() });
    refreshBooks();
  };

  const refreshBooks = async () => {
    const data = await apiCall('book', 'GET', null, {
      limit: limit,
      offset: (page - 1) * limit, // minus 1 since offset is 0-indexed
    });

    setBooks(data.books);
    setPageCount(Math.ceil(data.total / limit));
  };

  // TODO: Re-fetch books every time page, filters or sorting order are updated
  useEffect(() => {
    refreshBooks();
  }, [page, limit]);

  return (
    <>
      <MainLayout>
        <Container
          sx={{
            height: books.length ? 'auto' : '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '48px',
            mb: '32px',
          }}
        >
          {books.length ? (
            <Shelf books={books} />
          ) : (
            <Typography variant="h3">
              Whoops! We let the books run away...
            </Typography>
          )}
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="secondary"
            shape="rounded"
          />
        </Container>
      </MainLayout>
    </>
  );
};

export default Dashboard;
