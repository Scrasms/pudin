import { Box, Stack, Typography } from '@mui/material';
import type { ShelfBook } from '../../utils/types';
import defaultCover from '../../assets/cover.png';
import { timestampToDate } from '../../utils/date';
import UserAvatar from '../UserAvatar';
import ProfileLink from '../ProfileLink';
import BookIconBar from './BookIconBar';
import { useNavigate } from 'react-router';
import TagList from '../TagList';

const MAX_TAGS = 5;

// Displays all details about a single book
const BookDetails = ({ book }: { book: ShelfBook }) => {
  const navigate = useNavigate();

  const bookData = book.book;
  const username = book.user.username;
  const avatar = book.user.image;

  const publishDate = timestampToDate(bookData.published_at);
  let createDate = bookData.created_at;
  if (createDate) {
    createDate = timestampToDate(createDate);
  }

  return (
    <>
      <Stack
        component="article"
        direction="row"
        spacing={2}
        sx={{ width: '100%' }}
      >
        <Box
          component="img"
          src={bookData.image || defaultCover}
          sx={{
            width: {
              xs: '128px',
              sm: '160px',
              md: '192px',
            },
            objectFit: 'contain',
            aspectRatio: 128 / 200,
          }}
        />
        <Stack sx={{ flex: 1, justifyContent: 'space-between' }}>
          <Stack useFlexGap spacing={0.8}>
            <Typography
              sx={{ fontSize: { xs: '1.5rem', sm: '1.6rem', md: '2rem' } }}
            >
              {bookData.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <UserAvatar username={username} image={avatar} />
              <ProfileLink uid={bookData.written_by} username={username} />
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap' }}
              useFlexGap
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', md: '1rem' },
                }}
              >
                {' '}
                Published: {publishDate}{' '}
              </Typography>
              {createDate && (
                <Typography
                  sx={{
                    color: 'grey',
                    fontWeight: 500,
                    fontSize: { xs: '0.8rem', md: '1rem' },
                  }}
                >
                  (Created: {createDate})
                </Typography>
              )}
            </Stack>

            <BookIconBar
              likes={bookData.total_likes}
              reads={bookData.total_reads}
              chapters={bookData.total_chapters}
            />
          </Stack>
          
          <TagList
            tags={bookData.tags}
            onClick={(tag) => navigate(`/dashboard?tag=${tag}`)}
            sx={{
              flexWrap: 'wrap',
              alignContent: 'flex-start',
              overflow: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
            }}
            maxDisplayed={MAX_TAGS}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default BookDetails;
