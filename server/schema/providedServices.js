export default `
  type ProvidedServices {
    id: Int!
    title: String!
    description: String!
    address: String!
    photoUrl: String!
    date: String!
    username: String!
  }

  type Mutation {
    createProvidedService(
      title: String!, 
      description: String!, 
      address: String!
      photoUrl: String!,
      username: String!
      ): Boolean!
  }

  type Query {
    getProvidedService(id: Int!): NeededServices!
    getAllProvidedServices: [NeededServices!]!
  }
`;
