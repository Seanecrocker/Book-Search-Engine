const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4'); // This allows Apollo to work with Express
const { typeDefs, resolvers } = require('./schemas'); 
const { authMiddleware } = require('./utils/auth'); // Auth middleware for GraphQL context
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server
const startApolloServer = async () => {
  await server.start();

  // Apply Apollo middleware here, with the authMiddleware for context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const { user } = authMiddleware({ req });
        return { user };
      },
    })
  );


  app.use(routes);


  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
};

// Call the function to start the Apollo Server and Express app
startApolloServer();
