export default `
  type NeededServices {
    id: Int!
    title: String!
    description: String!
    address: String!
    photoUrl: String!
    date: String!
    username: String!
  }

  type Mutation {
    createNeededService(
      title: String!, 
      description: String!, 
      address: String!
      photoUrl: String!,
      username: String!
      ): Boolean!
  }

  type Query {
    getNeededService(id: Int!): NeededServices!
    getAllNeededServices: [NeededServices!]!
  }

`;
