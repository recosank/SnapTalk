import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { from } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "http://localhost:3000/api/graphql",
  credentials: "same-origin",
});
const getAuthLink = (ctx) => {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: typeof window === "undefined" ? ctx?.token : "",
      },
    };
  });
};

//const wsLink =
//  typeof window !== "undefined"
//    ? new GraphQLWsLink(
//        createClient({
//          url: "ws://localhost:3000/api/graphql",
//
//          options: {
//            reconnect: true,
//            minTimeout: 30000,
//          },
//
//          on: {
//            connected: (ctx) => console.log("connected client"),
//            closed: (err) => console.log(err),
//            error: (err) => {
//              console.log(err);
//            },
//          },
//        })
//      )
//    : null;
//
//const splitLink = (ctx = null) =>
//  typeof window !== "undefined" && wsLink != null
//    ? split(
//        ({ query }) => {
//          const def = getMainDefinition(query);
//          console.log(def);
//          return (
//            def.kind === "OperationDefinition" &&
//            def.operation === "subscription"
//          );
//        },
//        wsLink,
//        from([getAuthLink(ctx), httpLink])
//      )
//    : from([getAuthLink(ctx), httpLink]);
//
//function createApolloClient(ctx) {
//  return new ApolloClient({
//    ssrMode: typeof window === undefined,
//    link:      //splitLink(ctx),
//    cache: new InMemoryCache(),
//  });
//}
function createApolloClient(ctx) {
  return new ApolloClient({
    ssrMode: typeof window === undefined,
    link: from([getAuthLink(ctx), httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        allposts: {
          keyFields: ["puid"],
        },
      },
    }),
  });
}

export default createApolloClient;
