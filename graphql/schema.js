import { gql } from "apollo-server-micro";

const typeDefs = gql`
  type User {
    fname: String!
    fuid: String!
    following: [String]!
    follow: [String]!
  }
  type Post {
    title: String!
    puid: String!
    user_name: String!
  }

  type Query {
    user(fname: String!): User!
    users: [User!]!
    posts(fname: String!): [Post!]!
  }
  type Mutation {
    addfuser(fname: String!, confirmPassword: String!, password: String!): User!
    logfuser(fname: String!, password: String!): User!
    addfpost(title: String!): Post!
    updatefpost(title: String!, fuid: String!): Post!
    addfl(fname: String!): String
    remfl(fname: String!): String
  }
`;

export default typeDefs;
