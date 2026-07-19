import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { apiCall } from '../utils/api';
import type { ShelfBook } from '../utils/types';
import MainLayout from '../components/Layouts/MainLayout';
import BookDetails from '../components/Book/BookDetails';

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
      <MainLayout>{book && <BookDetails book={book} />}</MainLayout>
    </>
  );
};

export default Book;
