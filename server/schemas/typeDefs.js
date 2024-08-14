const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    _id: ID
    title: String
    authors: [String]
    description: String
    image: String
    link: String
    bookId: String
  }

  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    books: [Book]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }

  input BookInput {
    title: String
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
  }
`;

module.exports = typeDefs;