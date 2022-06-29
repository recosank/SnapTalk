import { gql } from "apollo-server-micro";

const typeDefs = gql`
  type User {
    fname: String!
    pname: String!
    isopen: Boolean!
    fuid: String!
    following: [String]!
    follow: [String]!
  }
  type Post {
    title: String!
    puid: String!
    user_name: String!
    likes: [String]!
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
    getFo: [String]!
    getmessages(receiver: String!): [Message]!
  }
  type Mutation {
    addfuser(
      fname: String!
      pname: String!
      confirmPassword: String!
      password: String!
    ): User!
    logfuser(fname: String!, password: String!): User!
    update_fuser(isopen: Boolean!): User!
    addfpost(title: String!): Post!
    updateAddLike(puid: String): Post!
    updateRemLike(puid: String): Post!
    addfl(fname: String!): String
    remfl(fname: String!): String
    sendmessage(receiver: String!, content: String!): Message!
  }
  type Subscription {
    newMessage(muid: String): Message!
  }
`;

export default typeDefs;
