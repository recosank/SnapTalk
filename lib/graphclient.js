import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import getConfig from "next/config";
import { setContext } from "@apollo/client/link/context";
import { from } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { w3cwebsocket } from "websocket";
import { createClient } from "graphql-ws";

const { publicRuntimeConfig } = getConfig();

const httpLink = new HttpLink({
  uri: "http://localhost:3000/api/graphql",
  credentials: "same-origin",
});
const getAuthLink = (ctx) => {
  return setContext((_, { headers }) => {
    console.log("in auth 1");

    console.log(ctx);

    return {
      headers: {
        ...headers,
        authorization: typeof window === "undefined" ? ctx?.token : "",
      },
    };
  });
};
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:3000/api/graphql",
    webSocketImpl: w3cwebsocket,
  })
);

const splitLink = (ctx) =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },

    wsLink,
    from([getAuthLink(ctx), httpLink])
  );
function createApolloClient(ctx) {
  return new ApolloClient({
    ssrMode: typeof window === undefined,
    link: splitLink(ctx),
    cache: new InMemoryCache(),
  });
}
//
//function createApolloClient() {
//  return new ApolloClient({
//    ssrMode: typeof window === 'undefined',
//    link: new HttpLink({
//      uri: "http://localhost:3000/api/graphql",
//      credentials: 'same-origin',
//      //headers: {
//      //  cookie: req.header.cookie,
//      //  },
//    }),
//    cache: new InMemoryCache(),
//  });
//}

export default createApolloClient;
