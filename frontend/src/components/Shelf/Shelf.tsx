import { Grid } from '@mui/material';
import ShelfItem from './ShelfItem';
import type { ShelfBook } from '../../utils/types';
import { Fragment } from 'react';
import ShelfTags from './ShelfTags';

// 3-column-wide grid containing books displayed as ShelfItems
const Shelf = ({ books }: { books: Array<ShelfBook> }) => {
  return (
    <>
      <Grid
        container
        spacing={2}
        columns={{ xs: 1, sm: 2, md: 3 }}
        sx={{ height: '100%', width: { xs: '80%', sm: '100%' } }}
      >
        {books.map((book, index) => (
          <Fragment key={index}>
            <Grid
              component="article"
              size={1}
              sx={{
                bgcolor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <ShelfItem book={book} />
              <ShelfTags tags={book.book.tags}/>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </>
  );
};

export default Shelf;
