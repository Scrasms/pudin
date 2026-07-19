import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiCall } from "../utils/api";
import type { ShelfBook } from "../utils/types";

// Page providing expanded details of one book
const Book = () => {
  const { bid } = useParams();
  const [, setBook] = useState<ShelfBook>();

  useEffect(() => {
    const refreshBook = async () => {
      const data = await apiCall(`book/${bid}`, 'GET');
      setBook(data.book);
      console.log(data);
    }
    refreshBook();
  }, []);

  return (
    <>

    </>
  );
}

export default Book;