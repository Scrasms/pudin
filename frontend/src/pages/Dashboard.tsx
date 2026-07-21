import { Container, Pagination, Typography } from '@mui/material';
import MainLayout from '../components/Layouts/MainLayout';
import Shelf from '../components/Shelf/Shelf';
import { useEffect, useState, type ChangeEvent } from 'react';
import { apiCall } from '../utils/api';
import { useSearchParams } from 'react-router';
import { limits, orders } from '../utils/options';
import ShelfToolbar from '../components/Shelf/ShelfToolbar';

const DEFAULT_LIMIT = 12;
const DEFAULT_ORDER = 'title';

// Default page for authorised users
const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

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

  // Remove dupes/null and restrict to 5 tags to guard against user input via url
  let tags = searchParams.getAll('tag');
  tags = [...new Set(tags.slice(0, 5))];
  tags = tags.filter((tag) => tag);

  let search = searchParams.get('search');
  if (!search) {
    search = '';
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
  };

  useEffect(() => {
    // Fetch books at current page with filters and sorting order
    const refreshBooks = async () => {
      const data = await apiCall('book', 'GET', null, {
        limit: limit,
        offset: (page - 1) * Number(limit), // minus 1 since offset is 0-indexed
        order: asc ? '+' + order : '-' + order,
        ...(tags.length > 0 && { tags: tags }),
        searchQuery: search,
      });

      setBooks(data.books);
      setPageCount(Math.ceil(data.total / Number(limit)));
      setLoading(false);
    };
    refreshBooks();
  }, [page, limit, order, asc, JSON.stringify(tags), search]);

  return (
    <>
      <MainLayout>
        <ShelfToolbar
          limit={limit}
          order={order as string}
          tags={tags}
          setAsc={setAsc}
        />

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
          {books.length > 0 && <Shelf books={books} />}

          {books.length === 0 && !loading && (
            <Typography variant="h3">
              {"We can't find the books you're looking for..."}
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
