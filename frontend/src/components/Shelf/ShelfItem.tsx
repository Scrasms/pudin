import { Box, Stack, Typography } from '@mui/material';
import type { ShelfBook } from '../../utils/types';
import cover from '../../assets/cover.png';

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
        sx={{ width: '128px', height: '200px' }}
      />
      <Box sx={{ p: '5px 12px', width: '250px', maxHeight: '200px' }}>
        <Typography
          sx={{
            fontSize: '1.2rem',
            fontWeight: '500',
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
          }}
        >
          {book.book.blurb ||
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint, facere, quam maiores dolorem quis tempora fugiat earum magnam velit suscipit, reprehenderit ab cupiditate. Officia blanditiis ullam quisquam suscipit, deleniti earum!'}
        </Typography>

        <Typography sx={{ fontSize: '1rem' }}>
          Author: {book.user.username}
        </Typography>

        <Typography sx={{ fontSize: '1rem' }}>Posted: {publishDate}</Typography>

        <Stack direction={'row'} spacing={2}>
          <Typography>Likes: {book.book.total_likes}</Typography>
          <Typography>Reads: {book.book.total_reads}</Typography>
          <Typography>Chapters: {book.book.total_chapters}</Typography>
        </Stack>
      </Box>
    </>
  );
};

export default ShelfItem;
