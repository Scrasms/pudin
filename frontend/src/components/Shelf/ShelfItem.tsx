import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import type { ShelfBook } from '../../utils/types';
import cover from '../../assets/cover.png';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListIcon from '@mui/icons-material/List';
import IconLabel from '../IconLabel';

// TODO: implement opening the book
// TODO: fix covers shrinking at different rates and add clickable link to author's profile using navigate()
// Displays the given book's data as a clickable card
const ShelfItem = ({ book }: { book: ShelfBook }) => {
  return (
    <>
      <CardActionArea>
        <Card
          sx={{
            display: 'flex',
            height: '100%',
            boxShadow: 3,
            bgcolor: 'primary.main',
          }}
        >
          <CardMedia
            image={book.book.image || cover}
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

              <Stack
                direction={'row'}
                sx={{ gap: '0rem 0.8rem', flexWrap: 'wrap' }}
              >
                <IconLabel
                  icon={FavoriteIcon}
                  label={book.book.total_likes}
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
                  label={book.book.total_reads}
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
                  label={book.book.total_chapters}
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
            </Box>
          </CardContent>
        </Card>
      </CardActionArea>
    </>
  );
};

export default ShelfItem;
