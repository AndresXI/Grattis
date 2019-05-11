export default `
  type NeededServices {
    id: Int!
    title: String!
    description: String!
    address: String!
    addressCoords: String!
    username: String!
  }

  type Subscription {
    newServiceNeeded: NeededServices!
  }

  type Mutation {
    createNeededService(
      title: String!, 
      description: String!, 
      address: String!
      addressCoords: String!
      username: String!
      ): Boolean!
  }

  type Query {
    getNeededService(id: Int!): NeededServices!
    getAllNeededServices: [NeededServices!]!
  }
`;
