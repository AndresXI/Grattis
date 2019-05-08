import React, { Component } from 'react';
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

class App extends Component {
  componentWillMount() {
    console.log('hi');
  }

  render() {
    return (
      <Query query={allServicesProvidedQuery}>
        {({
          loading, error, data, refetch, subscribeToMore,
        }) => (
          <div className="app-layout">
              <SideMenu refetch={refetch} />
              <Map subscribeToMore={subscribeToMore} data={data} />
            </div>
        )}
      </Query>
    );
  }
}


export default App;
