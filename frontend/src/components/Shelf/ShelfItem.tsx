import { Box, Stack, Typography } from '@mui/material';
import type { ShelfBook } from '../../utils/types';
import cover from '../../assets/cover.png';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListIcon from '@mui/icons-material/List';
import IconLabel from '../IconLabel';

// TODO: implement opening the book
// TODO: fix responsiveness and add clickable link to author's profile
// Displays the given book's data as a clickable card
const ShelfItem = ({ book }: { book: ShelfBook }) => {
  const publishTime = new Date(book.book.published_at);
  let date: string = publishTime.getDate().toString();
  if (Number(date) < 10) {
    date = '0' + date;
  }

  let month: string = (publishTime.getMonth() + 1).toString();
  if (Number(month) < 10) {
    month = '0' + month;
  }

  const year = publishTime.getFullYear().toString().slice(2, 4);
  const publishDate = `${date}/${month}/${year}`;

  return (
    <>
      <Box
        component="img"
        src={book.book.image || cover}
        sx={{ width: '40%', aspectRatio: 128 / 200 }}
      />

      <Stack
        sx={{
          justifyContent: 'space-between',
          p: '5px 12px',
          width: '250px',
          maxHeight: '200px',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '1.2rem',
              fontWeight: 500,
              borderBottom: '2px solid',
              borderColor: 'primary.dark',
            }}
          >
            {book.book.title}
          </Typography>

          <Typography
            sx={{
              fontSize: '1rem',
              fontStyle: 'italic',
              // Display maximum of 3 lines before truncating with ellipsis
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              wordWrap: 'break-word',
              overflow: 'hidden',
              m: '5px 0px',
            }}
          >
            {book.book.blurb ||
              'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint, facere, quam maiores dolorem quis tempora fugiat earum magnam velit suscipit, reprehenderit ab cupiditate. Officia blanditiis ullam quisquam suscipit, deleniti earum!'}
          </Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '1rem' }}>
            <Box component="span" sx={{ fontWeight: 500 }}>
              Author:
            </Box>{' '}
            <Box
              component="a"
              sx={{ color: 'secondary.dark' }}
              href={`/${book.book.written_by}`}
            >
              {book.user.username}
            </Box>{' '}
          </Typography>

          <Typography sx={{ fontSize: '1rem' }}>{publishDate}</Typography>

          <Stack direction={'row'} spacing={2}>
            <IconLabel
              icon={FavoriteIcon}
              label={book.book.total_likes}
              iconProps={{ sx: { color: 'secondary.dark' } }}
            />

            <IconLabel
              icon={VisibilityIcon}
              label={book.book.total_reads}
              iconProps={{ sx: { color: 'secondary.dark' } }}
            />

            <IconLabel
              icon={ListIcon}
              label={book.book.total_chapters}
              iconProps={{ sx: { color: 'secondary.dark' } }}
            />
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default ShelfItem;
