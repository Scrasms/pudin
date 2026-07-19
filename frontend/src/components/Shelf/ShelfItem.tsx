import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import type { ShelfBook } from '../../utils/types';
import defaultCover from '../../assets/cover.png';
import { useNavigate } from 'react-router';
import ProfileLink from '../ProfileLink';
import { testBlurb } from '../../utils/options';
import BookIconBar from '../Book/BookIconBar';

// TODO: add clickable link to author's profile using navigate()
// Displays the given book's data as a clickable card (takes you to the larger book view)
const ShelfItem = ({ book }: { book: ShelfBook }) => {
  const navigate = useNavigate();
  const bookData = book.book;
  const userData = book.user;

  return (
    <>
      <CardActionArea
        sx={{ height: '100%' }}
        onClick={() => navigate(`/book/${bookData.bid}`)}
      >
        <Card
          sx={{
            display: 'flex',
            height: '100%',
            boxShadow: 3,
            bgcolor: 'primary.main',
          }}
        >
          <CardMedia
            image={bookData.image || defaultCover}
            sx={{ width: '40%', aspectRatio: 128 / 200 }}
          />

          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: '5px 12px',
              width: '60%',
            }}
          >
            <Box component="section">
              <Typography
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  borderBottom: '2px solid',
                  borderColor: 'primary.dark',
                }}
              >
                {bookData.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  // Display maximum of 4 lines before truncating with ellipsis
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                  m: '5px 0px',
                }}
              >
                {bookData.blurb || testBlurb}
              </Typography>
            </Box>

            <Box>
              <ProfileLink
                uid={bookData.written_by}
                username={userData.username}
                label={'Author: '}
              />

              <BookIconBar
                likes={bookData.total_likes}
                reads={bookData.total_reads}
                chapters={bookData.total_chapters}
              />
            </Box>
          </CardContent>
        </Card>
      </CardActionArea>
    </>
  );
};

export default ShelfItem;
