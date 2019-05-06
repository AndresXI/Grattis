import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import models from './models';
// Merge all types from schema folder
const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
// Merge all resolvers from resolver folder
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
  },
});


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.applyMiddleware({ app });

models.sequelize.sync().then(() => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  app.listen(4000);
});
