import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import bodyParser from 'body-parser';

import models from './models';
import typeDefs from './schema';
import resolvers from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.applyMiddleware({ app });

models.sequelize.sync().then(() => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  app.listen(4000);
});
