import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { apiCall } from '../utils/api';
import type { ShelfBook } from '../utils/types';
import MainLayout from '../components/Layouts/MainLayout';
import BookDetails from '../components/Book/BookDetails';
import { Stack } from '@mui/material';
import BookBlurb from '../components/Book/BookBlurb';
import { testBlurb } from '../utils/options';
import ChapterList from '../components/Book/ChapterList';

//TODO: remove testblurb
// Page providing expanded details of one book
const Book = () => {
  const { bid } = useParams();
  const [book, setBook] = useState<ShelfBook>();

  useEffect(() => {
    const refreshBook = async () => {
      const data = await apiCall(`book/${bid}`, 'GET');
      setBook(data);
    };
    refreshBook();
  }, []);

  return (
    <>
      <MainLayout>
        {book && (
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '80%',
              m: '0 auto',
              mb: '32px'
            }}
            useFlexGap
            spacing={2}
          >
            <BookDetails book={book} />
            <BookBlurb blurb={book.book.blurb || testBlurb} />
            <ChapterList chapters={book.book.chapters}/>
          </Stack>
        )}
      </MainLayout>
    </>
  );
};

export default Book;
