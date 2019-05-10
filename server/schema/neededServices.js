export default `
  type NeededServices {
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
    newServiceNeeded: NeededServices!
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
    getProvidedService(id: Int!): NeededServices!
    getAllProvidedServices: [NeededServices!]!
  }
`;
