import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import type { Chapter } from '../../utils/types';
import IconLabel from '../IconLabel';
import { timestampToDate } from '../../utils/date';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';

// An item of the ChapterList displaying each chapter's details
const ChapterListItem = ({ chapter }: { chapter: Chapter }) => {
  let publishDate = chapter.published_at;
  if (publishDate) {
    publishDate = timestampToDate(chapter.published_at);
  }

  let createDate = chapter.created_at;
  if (createDate) {
    createDate = timestampToDate(createDate);
  }

  const heading = (
    <>
      <Typography
        sx={{
          fontSize: {
            xs: '0.8rem',
            sm: '1rem',
          },
        }}
      >
        <Box component="span" sx={{ fontWeight: 500 }}>
          {chapter.title}
        </Box>
        {!publishDate && (
          <Box
            component="span"
            sx={{ color: '#0000008a', fontWeight: 500, ml: 1 }}
          >
            (Draft)
          </Box>
        )}
      </Typography>
    </>
  );

  const subheading = (
    <Typography
      sx={{
        fontSize: {
          color: '#0000008a',
          xs: '0.8rem',
          sm: '1rem',
        },
      }}
    >
      {publishDate ? `Published ${publishDate}` : `Created ${createDate}`}
    </Typography>
  );

  const iconSx = {
    fontSize: {
      xs: '1rem',
      sm: '1.2rem',
      md: '1.5rem',
    },
  };

  const textSx = {
    fontSize: {
      xs: '0.8rem',
      sm: '1rem',
    },
  };

  return (
    <>
      <ListItem disablePadding alignItems="flex-start">
        <ListItemButton>
          <ListItemText primary={heading} secondary={subheading}></ListItemText>

          <Stack direction="row" useFlexGap spacing={1}>
            <ListItemIcon>
              <IconLabel
                icon={FavoriteIcon}
                label={chapter.likes}
                iconSx={iconSx}
                textSx={textSx}
              />
            </ListItemIcon>

            <ListItemIcon>
              <IconLabel
                icon={VisibilityIcon}
                label={chapter.reads}
                iconSx={iconSx}
                textSx={textSx}
              />
            </ListItemIcon>
          </Stack>
        </ListItemButton>
      </ListItem>
    </>
  );
};

export default ChapterListItem;
