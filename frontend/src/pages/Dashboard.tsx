import { Container, Pagination, Stack, Typography } from '@mui/material';
import MainLayout from '../components/Layouts/MainLayout';
import Shelf from '../components/Shelf/Shelf';
import { useEffect, useState, type ChangeEvent } from 'react';
import { apiCall } from '../utils/api';
import { useSearchParams } from 'react-router';
import ShelfSelect from '../components/Shelf/ShelfActions';

const DEFAULT_LIMIT = 1;

const limits = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '12',
    value: 12,
  },
  {
    label: '24',
    value: 24,
  },
  {
    label: '36',
    value: 36,
  },
  {
    label: '48',
    value: 48,
  },
  {
    label: '60',
    value: 60,
  },
];

const orders = [
  {
    label: 'Title',
    value: 'title',
  },
  {
    label: 'Date Published',
    value: 'published_at',
  },
  {
    label: 'Likes',
    value: 'total_likes',
  },
  {
    label: 'Reads',
    value: 'total_reads',
  },
];

// TODO: give users sorting and filtering options, including altering limit
const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Clamp searchParams to defaults
  let page = Number(searchParams.get('page'));
  if (page < 1 || isNaN(page)) {
    page = 1;
  }

  let limit = Number(searchParams.get('show'));
  if (!limits.some((opt) => opt.value === limit) || isNaN(limit)) {
    limit = DEFAULT_LIMIT;
  }

  const [books, setBooks] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [order, setOrder] = useState<string | number>('title');

  const handlePageChange = (
    _event: ChangeEvent<unknown, Element>,
    page: number,
  ) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      return prev;
    });
    refreshBooks();
  };

  // Also resets page back to 1 to avoid showing empty pages
  const handleLimitChange = (value: string | number) => {
    setSearchParams((prev) => {
      prev.set('show', value.toString());
      prev.set('page', '1');
      return prev;
    });
  };

  const refreshBooks = async () => {
    const data = await apiCall('book', 'GET', null, {
      limit: limit,
      offset: (page - 1) * Number(limit), // minus 1 since offset is 0-indexed
    });

    setBooks(data.books);
    setPageCount(Math.ceil(data.total / Number(limit)));
  };

  // TODO: Re-fetch books every time page, filters or sorting order are updated
  useEffect(() => {
    refreshBooks();
  }, [page, limit, order]);

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
          <Stack direction="row" spacing={2}>
            <ShelfSelect
              label="Show"
              value={limit}
              setValue={handleLimitChange}
              options={limits}
            />

            <ShelfSelect
              label="Sort by"
              value={order}
              setValue={setOrder}
              options={orders}
            />
          </Stack>

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
