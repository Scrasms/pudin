import { Box, Button, Stack, Typography } from '@mui/material';
import type { ShelfBook } from '../../utils/types';
import defaultCover from '../../assets/cover.png';
import { timestampToDate } from '../../utils/date';
import UserAvatar from '../UserAvatar';
import ProfileLink from '../ProfileLink';
import { useLayoutEffect, useRef, useState } from 'react';
import { testBlurb } from '../../utils/options';
import BookIconBar from './BookIconBar';

// Displays all details about a single book
const BookDetails = ({ book }: { book: ShelfBook }) => {
  const [allBlurb, setAllBlurb] = useState(false);
  const [blurbOverflow, setBlurbOverflow] = useState(false);
  const blurbRef = useRef<HTMLPreElement>(null);

  const bookData = book.book;
  const username = book.user.username;
  const avatar = book.user.image;

  const publishDate = timestampToDate(bookData.published_at);
  let createDate = bookData.created_at;
  if (createDate) {
    createDate = timestampToDate(createDate);
  }

  // Display 'show' button for blurb only if text overflows
  useLayoutEffect(() => {
    if (
      blurbRef.current &&
      blurbRef.current.clientHeight < blurbRef.current.scrollHeight
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlurbOverflow(true);
    }
  }, [bookData.blurb]);

  return (
    <>
      <Stack
        component="article"
        direction="row"
        spacing={2}
        sx={{ height: 'fit-content', width: '100%', justifyContent: 'center' }}
      >
        <Box
          component="img"
          src={bookData.image || defaultCover}
          sx={{
            height: {
              xs: '250px',
              sm: '300px',
              md: '400px',
            },
            aspectRatio: 128 / 200,
          }}
        />

        <Stack sx={{ width: '50%' }} useFlexGap spacing={0.8}>
          <Typography
            sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' } }}
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
            <Typography sx={{ fontWeight: 500, }}> Published: {publishDate} </Typography>
            {createDate && (
              <Typography sx={{ fontWeight: 500, color: 'grey' }}>
                (Created: {createDate})
              </Typography>
            )}
          </Stack>

          <BookIconBar
            likes={bookData.total_likes}
            reads={bookData.total_reads}
            chapters={bookData.total_chapters}
          />

          <Typography
            component="pre"
            ref={blurbRef}
            sx={{
              fontSize: {
                xs: '0.8rem',
                md: '1rem'
              },
              whiteSpace: 'pre-wrap',
              ...(!allBlurb && {
                display: '-webkit-box',
                WebkitLineClamp: {
                  xs: 5,
                  sm: 6,
                  md: 8,
                },
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
                overflow: 'hidden',
              }),
            }}
          >
            {bookData.blurb || testBlurb}
          </Typography>

          {blurbOverflow && (
            <Button
              color="secondary"
              sx={{ display: 'block', ml: 'auto' }}
              onClick={() => setAllBlurb((prev) => !prev)}
              size="small"
            >
              {!allBlurb ? 'Show' : 'Hide'}
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default BookDetails;
