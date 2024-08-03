import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../graphql/mutations';
import Auth from '../utils/auth';

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink,
      }));

      setSearchResults(bookData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchResults.find((book) => book.bookId === bookId);

    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await saveBook({
        variables: { input: bookToSave },
      });

      // Remove book from search results
      setSearchResults(searchResults.filter((book) => book.bookId !== bookId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Search for a book"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {searchResults.map((book) => (
          <div key={book.bookId}>
            <p>{book.title}</p>
            <p>{book.authors.join(', ')}</p>
            <img src={book.image} alt={book.title} />
            <p>{book.description}</p>
            <a href={book.link} target="_blank" rel="noopener noreferrer">
              View Book
            </a>
            <button onClick={() => handleSaveBook(book.bookId)}>Save This Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;