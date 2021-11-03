const express = require('express'),
  http = require('http'),
  path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema } = require('@graphql-tools/schema');

async function startExpressApolloServer() {
  const typeDefs = require('./schema');
  const resolvers = require('./resolvers');
  const permissions = require('./permissions');

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    resolvers,

    context: ({ req }) => {
      return {
        user: req.headers.user || '',
      };
    },
  });
  await server.start();
  const app = express();
  server.applyMiddleware({ app, path: '/graphql' });

  await new Promise((resolve) => app.listen({ port: 3001 }, resolve));
  console.log(`Server ready at http://localhost:3001${server.graphqlPath}`);
  return { server, app };
}

startExpressApolloServer();
