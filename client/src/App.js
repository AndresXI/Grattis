import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import MenuToggle from './components/MenuToggle';
import Map from './containers/Map';
import SideMenu from './containers/SideMenu';
import MenuContainer from './components/MenuContainer';

const allServicesProvidedQuery = gql`
{
  getAllProvidedServices {
    title
    description
    username
    address
    addressCoords
    photoUrl
  }
}
`;

// TODO: Nest multiple queries and rename variables
class App extends Component {
  render() {
    // console.log('this', this.props);
    return (
      <Query query={allServicesProvidedQuery}>
        {({
          loading, error, data, refetch, subscribeToMore,
        }) => (
          <div className="app-layout">
              <SideMenu
                refetchNeeded={this.props.refetchNeeded}
                data={data}
                refetch={refetch}
              />
              <MenuContainer
                data={data}
                refetchNeeded={this.props.refetchNeeded}
                refetch={refetch}
              />
              <MenuToggle />
              <Map
                subscribeToMoreNeeded={this.props.subscribeToMoreNeeded}
                neededServices={this.props.servicesNeeded}
                subscribeToMoreProvided={subscribeToMore}
                data={data}
              />
            </div>
        )
        }
      </Query>
    );
  }
}


export default App;
