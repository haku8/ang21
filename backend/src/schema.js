export const typeDefs = `#graphql
  type Item {
    id: ID!
    name: String!
    text1: String
    text2: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    items: [Item!]!
    item(id: ID!): Item
  }

  type Mutation {
    createItem(name: String!, text1: String, text2: String): Item!
    updateItem(id: ID!, name: String, text1: String, text2: String): Item!
    deleteItem(id: ID!): Boolean!
  }
`;
