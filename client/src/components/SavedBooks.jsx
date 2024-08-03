// src/components/SavedBooks.jsx
import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';
import Auth from '../utils.auth';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || {};

  const handleRemoveBook = async (bookId) => {
    try {
      await removeBook({
        variables: { bookId },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <div>
      <h2>Viewing saved books</h2>
      <div>
        {userData.savedBooks?.map((book) => (
          <div key={book.bookId}>
            <p>{book.title}</p>
            <p>{book.authors.join(', ')}</p>
            <img src={book.image} alt={book.title} />
            <p>{book.description}</p>
            <a href={book.link} target="_blank" rel="noopener noreferrer">
              View Book
            </a>
            <button onClick={() => handleRemoveBook(book.bookId)}>Delete This Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedBooks;