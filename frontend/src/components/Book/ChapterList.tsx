import { List, Typography } from '@mui/material';
import type { Chapter } from '../../utils/types';
import ChapterListItem from './ChapterListItem';
import BookAccordion from './BookAccordian';

// List displaying all chapters in a book
const ChapterList = ({ chapters }: { chapters: Array<Chapter> }) => {
  return (
    <>
      <BookAccordion
        name="chapter-list"
        summary="Chapters"
        disableDetailsGutters={chapters.length > 0}
      >
        {chapters.length > 0 ? (
          <List aria-label="chapter list">
            {chapters.map((chapter, index) => {
              return <ChapterListItem key={index} chapter={chapter} />;
            })}
          </List>
        ) : (
          <Typography
            sx={{
              fontSize: { xs: '0.8rem', sm: '1rem' },
              color: '#0000008a',
            }}
          >
            No chapters yet...
          </Typography>
        )}
      </BookAccordion>
    </>
  );
};

export default ChapterList;
