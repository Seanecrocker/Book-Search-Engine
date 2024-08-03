// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

const Navbar = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Search Books</Link>
        </li>
        {Auth.loggedIn() ? (
          <>
            <li>
              <Link to="/saved">Saved Books</Link>
            </li>
            <li>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;