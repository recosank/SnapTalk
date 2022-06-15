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
  type Message {
    muid: String!
    content: String!
    sender: String!
    receiver: String!
  }
  type Query {
    user(fname: String!): User!
    users: [User!]!
    posts(fname: String!): [Post!]!
    allposts: [Post!]!
    getFl: [String]!
    getmessages: [Message]!
  }
  type Mutation {
    addfuser(fname: String!, confirmPassword: String!, password: String!): User!
    logfuser(fname: String!, password: String!): User!
    addfpost(title: String!): Post!
    updatefpost(title: String!, fuid: String!): Post!
    addfl(fname: String!): String
    remfl(fname: String!): String
    sendmessage(receiver: String!, content: String!): Message!
  }
`;

export default typeDefs;
