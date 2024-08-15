const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const mongoose = require('mongoose');  // Import mongoose to handle MongoDB connections

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection using Mongoose
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name';
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌍 Now listening on http://localhost:${PORT}`);
  });
};

startApolloServer();