import {
  Container,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import MainLayout from '../components/Layouts/MainLayout';
import Shelf from '../components/Shelf/Shelf';
import { useEffect, useState, type ChangeEvent } from 'react';
import { apiCall } from '../utils/api';
import { useSearchParams } from 'react-router';
import ShelfSelect from '../components/Shelf/ShelfSelect';
import { limits, orders } from '../utils/ShelfOptions';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const DEFAULT_LIMIT = 12;
const DEFAULT_ORDER = 'title';

// TODO: give users filtering options
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

  let order = searchParams.get('sortBy');
  if (!orders.some((opt) => opt.value === order)) {
    // Order will never be null after this so typecasting as string is safe
    order = DEFAULT_ORDER;
  }

  const [books, setBooks] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [asc, setAsc] = useState(true);

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

  // Also resets page back to 1 to avoid confusion
  const handleOrderChange = (value: string | number) => {
    setSearchParams((prev) => {
      prev.set('sortBy', value.toString());
      prev.set('page', '1');
      return prev;
    });
  };

  // Fetch books at current page with filters and sorting order
  const refreshBooks = async () => {
    const data = await apiCall('book', 'GET', null, {
      limit: limit,
      offset: (page - 1) * Number(limit), // minus 1 since offset is 0-indexed
      order: asc ? '+' + order : '-' + order,
    });

    setBooks(data.books);
    setPageCount(Math.ceil(data.total / Number(limit)));
  };

  // TODO: Re-fetch books every time page, filters or sorting order are updated
  useEffect(() => {
    refreshBooks();
  }, [page, limit, order, asc]);

  return (
    <>
      <MainLayout>
        <Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
          <ShelfSelect
            label="Show"
            value={limit}
            setValue={handleLimitChange}
            options={limits}
          />

          <ShelfSelect
            label="Sort by"
            value={order as string}
            setValue={handleOrderChange}
            options={orders}
          />

          <IconButton
            aria-label="swap sorting order"
            onClick={() => setAsc(asc => !asc)}
          >
            <SwapVertIcon sx={{ color: 'secondary.dark' }} />
          </IconButton>
        </Stack>

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
