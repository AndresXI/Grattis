import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';


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

const MainView = () => (
  <Query query={allServicesProvidedQuery}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      return (
        <div>
          <h1>
            Main View {data.getAllProvidedServices[0].title}
          </h1>
        </div>
      );
    }}
  </Query>
);

export default MainView;
