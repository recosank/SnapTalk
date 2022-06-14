import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import getConfig from "next/config";
import { setContext } from "@apollo/client/link/context";
import { from } from "@apollo/client";

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

function createApolloClient(ctx) {
  return new ApolloClient({
    ssrMode: typeof window === undefined,
    link: from([getAuthLink(ctx), httpLink]),
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
