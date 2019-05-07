import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Map from './containers/Map';
import SideMenu from './containers/SideMenu';

const allServicesProvidedQuery = gql`
{
  getAllProvidedServices {
    title
    description
    username
    address
  }
}
`;

const App = () => (
  <Query query={allServicesProvidedQuery}>
    {({
      loading, error, data, refetch,
    }) => (
      <div className="app-layout">
          <SideMenu refetch={refetch} />
          <Map data={data} />
        </div>
    )}
  </Query>
);
export default App;
