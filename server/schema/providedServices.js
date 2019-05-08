export default `
  type ProvidedServices {
    id: Int!
    title: String!
    description: String!
    address: String!
    addressCoords: String!
    photoUrl: String!
    username: String!
    createdAt: String!
  }

  type Subscription {
    newServiceProvided: ProvidedServices!
  }

  type Mutation {
    createProvidedService(
      title: String!, 
      description: String!, 
      address: String!
      addressCoords: String!
      photoUrl: String!,
      username: String!
      ): Boolean!
  }

  type Query {
    getProvidedService(id: Int!): ProvidedServices!
    getAllProvidedServices: [ProvidedServices!]!
  }
`;
