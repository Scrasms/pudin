import { Typography } from '@mui/material';
import BookAccordion from './BookAccordian';

// Displays the provided blurb in an accordion
const BookBlurb = ({ blurb }: { blurb: string }) => {
  return (
    <>
      <BookAccordion name="blurb" summary="Blurb">
        <Typography
          component="pre"
          sx={{
            fontSize: {
              xs: '0.8rem',
              sm: '1rem',
            },
            whiteSpace: 'pre-wrap',
            overflow: 'auto',
            ...(!blurb && { color: '#0000008a' }),
          }}
        >
          {blurb || 'No blurb yet...'}
        </Typography>
      </BookAccordion>
    </>
  );
};

export default BookBlurb;
