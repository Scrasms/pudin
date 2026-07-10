import { Grid } from '@mui/material';
import ShelfItem from './ShelfItem';
import type { ShelfBook } from '../../utils/types';

const Shelf = ({ books }: { books: Array<ShelfBook> }) => {
  return (
    <>
      <Grid container spacing={2} sx={{ height: '100%', width: '100%' }}>
        {/* <Grid size={3} sx={{ border: '2px solid black' }}>size=8</Grid> */}
        {books.map((book, index) => (
          <>
            <Grid size={4} sx={{ border: '2px solid black' }}>
              <ShelfItem book={book} key={index} />
            </Grid>
          </>
        ))}
      </Grid>
    </>
  );
};

export default Shelf;
