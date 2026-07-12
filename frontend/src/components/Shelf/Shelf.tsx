import { Grid } from '@mui/material';
import ShelfItem from './ShelfItem';
import type { ShelfBook } from '../../utils/types';
import { Fragment } from 'react';

// TODO: Use pagination of backend API to NOT display ALL books at once
// 3-column-wide grid containing books displayed as ShelfItems
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
                boxShadow: 3,
                '&:hover': {
                  bgcolor: '#e7e5b7',
                },
                '&:active': {
                  bgcolor: 'primary.dark',
                }
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
