import { Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListIcon from '@mui/icons-material/List';
import IconLabel from '../IconLabel';

// Bar displaying icons for the number of likes, reads and chapters of a book
const BookIconBar = ({
  likes,
  reads,
  chapters,
}: {
  likes: number;
  reads: number;
  chapters: number;
}) => {
  return (
    <>
      <Stack
        direction="row"
        sx={{ gap: '0rem 0.8rem', flexWrap: 'wrap', mt: 0.5 }}
      >
        <IconLabel
          icon={FavoriteIcon}
          label={likes}
          iconProps={{
            sx: {
              color: 'secondary.dark',
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.5rem',
              },
            },
          }}
        />

        <IconLabel
          icon={VisibilityIcon}
          label={reads}
          iconProps={{
            sx: {
              color: 'secondary.dark',
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.5rem',
              },
            },
          }}
        />

        <IconLabel
          icon={ListIcon}
          label={chapters}
          iconProps={{
            sx: {
              color: 'secondary.dark',
              fontSize: {
                xs: '1rem',
                sm: '1.2rem',
                md: '1.5rem',
              },
            },
          }}
        />
      </Stack>
    </>
  );
};

export default BookIconBar;
