import {
  Box,
  Chip,
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
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ShelfTagField from '../components/Shelf/ShelfTagField';
import { useTag } from '../hooks/useTag';

const DEFAULT_LIMIT = 12;
const DEFAULT_ORDER = 'title';

const limits = [
  { label: '1', value: 1 },
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

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, removeTag] = useTag();

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
    };
    refreshBooks();
  }, [page, limit, order, asc, JSON.stringify(tags), search]);

  return (
    <>
      <MainLayout>
        <Box>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              p: {
                xs: '0px 20px',
                sm: '0px',
              },
            }}
          >
            <ShelfTagField />

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
                onClick={() => setAsc((asc) => !asc)}
              >
                <SwapVertIcon sx={{ color: 'secondary.dark' }} />
              </IconButton>
            </Stack>
          </Stack>

          {tags.length > 0 && (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mr: 'auto',
                height: '50px',
                width: '100%',
                m: {
                  xs: '5px 20px',
                  sm: '5px',
                },
                alignItems: 'center',
                overflowY: 'hidden',
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
              }}
            >
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  sx={{ fontWeight: 600 }}
                  onDelete={() => removeTag(tag)}
                />
              ))}
            </Stack>
          )}
        </Box>

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
