import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import cors from 'cors';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import getModels from './models';
// Merge all types from schema folder
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
// Merge all resolvers from resolver folder
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

getModels().then((models) => {
  if (!models) {
    console.log('could not connect to database');
    return;
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
      onConnect: (connectionParams, webSocket, context) => {
        console.log('connected client');
      },
    },
    context: {
      models,
    },
  });


  const app = express();
  app.use(cors('*'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  models.sequelize.sync({}).then(() => {
    httpServer.listen(4001, () => {
      console.log(`🚀 Server ready at http://localhost:4001${server.graphqlPath}`);
      console.log(`🚀 Subscriptions ready at ws://localhost:4001${server.subscriptionsPath}`);
    });
  });
});
