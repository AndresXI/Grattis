import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import './static/sass/main.scss';
import 'semantic-ui-css/semantic.min.css';
import App from './App';


const httpLink = new HttpLink({
  uri: `http://${process.env.REACT_APP_SERVER_URL}/graphql`,
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://${process.env.REACT_APP_SERVER_URL}/graphql`,
  options: {
    reconnect: true,
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Instantiate client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const allServicesNeededQuery = gql`
{
  getAllNeededServices {
    title
    description
    username
    address
    addressCoords
  }
}
`;


const app = (
  <ApolloProvider client={client}>
    <Query
      // fetchPolicy="network-only"
      query={allServicesNeededQuery}
    >
      {({ loading, error, data, refetch, subscribeToMore, }) => (
        <App
          refetchNeeded={refetch}
          subscribeToMoreNeeded={subscribeToMore}
          servicesNeeded={data}
        />
      )}
    </Query>
  </ApolloProvider>
);

ReactDOM.render(app, document.getElementById('root'));
