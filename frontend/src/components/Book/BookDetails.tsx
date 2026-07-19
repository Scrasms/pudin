import { Box, Button, Stack, Typography } from '@mui/material';
import type { ShelfBook } from '../../utils/types';
import defaultCover from '../../assets/cover.png';
import { timestampToDate } from '../../utils/date';
import UserAvatar from '../UserAvatar';
import ProfileLink from '../ProfileLink';
import { useLayoutEffect, useRef, useState } from 'react';

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
            sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' } }}
          >
            {bookData.title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <UserAvatar username={username} image={avatar} />
            <ProfileLink uid={bookData.written_by} username={username} />
          </Stack>

          <Typography sx={{ fontWeight: 500 }}>
            Published: {publishDate}
          </Typography>
          {createDate && (
            <Typography sx={{ fontWeight: 500, color: 'grey' }}>
              (Created: {createDate})
            </Typography>
          )}

          <Typography
            component="pre"
            ref={blurbRef}
            sx={{
              fontSize: '1rem',
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
            {bookData.blurb ||
              "In an alternate timeline, the human race found a way to create superpowers. By extracting energy from stars and inserting that energy into humans, 'powers' were created. Powers allowed humans to gain unnatural abilities such as flight, invisibility, super strength or in other words, superpowers. Of course, with the introduction of something so revolutionary, people rose up in the hundreds of thousands in an event known as the Great Rebellion. The insurgents banded together under a single banner and became collectively known as the Shadow, marking the beginning of the Cosmic Wars.\n Out of the darkness, the Gazers were born. Using what remained of the power technology, the Gazers singlehandedly perished the evil and ended the conflict. However, there was a price to pay. Powers put a toll on the human body and had serious mental and physical repercussions.  The solution was to recruit children from the age of 13 to 18 and train them so their bodies would adapt to their powers, eventually becoming immune to all negative side effects.\n The end of the Cosmic Wars brought forth a new age of peace and prosperity that the world had never seen before. However, the long reign of the Gazers has already begun to crumble, cracks showing up within the very thread of society. Their rule will not last for much longer. The Shadow will rise once again.\n Or in other words, my unintentional and accidental ripoff of My Hero Academia :/ Blurb is a work in progress"}
          </Typography>

          {blurbOverflow && (
            <Button
              color="secondary"
              sx={{ display: 'block', ml: 'auto' }}
              onClick={() => setAllBlurb((prev) => !prev)}
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
