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
import defaultCover from '../../assets/cover.png';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListIcon from '@mui/icons-material/List';
import IconLabel from '../IconLabel';
import { useNavigate } from 'react-router';
import ProfileLink from '../ProfileLink';

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
                {bookData.blurb}
              </Typography>
            </Box>

            <Box>
              <ProfileLink
                uid={bookData.written_by}
                username={userData.username}
                label={'Author: '}
              />

              <Stack
                direction="row"
                sx={{ gap: '0rem 0.8rem', flexWrap: 'wrap', mt: 0.5 }}
              >
                <IconLabel
                  icon={FavoriteIcon}
                  label={bookData.total_likes}
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
                  label={bookData.total_reads}
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
                  label={bookData.total_chapters}
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
