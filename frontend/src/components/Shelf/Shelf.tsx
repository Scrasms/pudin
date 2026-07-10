import { Grid } from '@mui/material';
import ShelfItem from './ShelfItem';
import type { ShelfBook } from '../../utils/types';
import { Fragment } from 'react';

const Shelf = ({ books }: { books: Array<ShelfBook> }) => {
  return (
    <>
      <Grid container spacing={2} sx={{ height: '100%', width: '100%' }}>
        {books.map((book, index) => (
          <Fragment key={index}>
            <Grid
              size={4}
              columns={3}
              sx={{
                display: 'flex',
                border: '2px solid',
                borderColor: 'primary.dark',
              }}
            >
              <ShelfItem book={book} />
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </>
  );
};

export default Shelf;
