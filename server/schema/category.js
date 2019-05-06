export default `
  type Category {
    id: Int!
    title: String!
  }

  type Query {
    getCategory(id: Int!): Category!
    getAllCategories: [Category!]!
  }

  type Mutation {
    createCategory(title: String!): Category!
  }
`;
