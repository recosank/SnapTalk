//import { WebSocketServer } from "ws";
//import { ApolloServer } from "apollo-server-micro";
//import resolvers from "../../graphql/resolvers";
//import typeDefs from "../../graphql/schema";
//import Cors from "micro-cors";
//import authg from "../../lib/auth";
//import Router from "next/router";
//import { PubSub } from "graphql-subscriptions";
//import { makeExecutableSchema } from "@graphql-tools/schema";
//import { useServer } from "graphql-ws/lib/use/ws";
//import { Disposable } from "graphql-ws";
//
//console.log("in subg");
//const cors = Cors();
//
//let serverCleanup = Disposable | null;
//
////const pubbsubb = new PubSub();
//const schema = makeExecutableSchema({ typeDefs, resolvers });
//const apolloServer = new ApolloServer({
//  schema,
//  playground: {
//    subscriptionEndpoint: "/api/subg",
//
//    settings: {
//      "request.credentials": "same-origin",
//    },
//  },
//  introspection: true,
//  subscriptions: {
//    path: "/api/subg",
//
//    onConnect: () => console.log("connected"),
//    onDisconnect: () => console.log("disconnected"),
//  },
//  context: ({ req, res }) => {
//    console.log("in cxt webs");
//    console.log("cal");
//
//    if (
//      req.headers.referer === "http://localhost:3000/signup" ||
//      req.headers.referer === "http://localhost:3000/login"
//    ) {
//      console.log("signup");
//
//      return res;
//    } else {
//      //console.log(req.cookies);
//      if (typeof window === "undefined") {
//        console.log("in ifffffff");
//
//        console.log(req.headers);
//
//        return req;
//      }
//
//      console.log("out ssr");
//
//      return req;
//    }
//  },
//  plugins: [
//    // Proper shutdown for the WebSocket server.
//    {
//      async serverWillStart() {
//        return {
//          async drainServer() {
//            await serverCleanup?.dispose();
//          },
//        };
//      },
//    },
//  ],
//});
//
//const startServer = apolloServer.start();
//const getHandler = async () => {
//  await startServer;
//  return apolloServer.createHandler({
//    path: "/api/subg",
//  });
//};
//const wsServer = new WebSocketServer({
//  noServer: true,
//});
//export default cors(async function handler(req, res) {
//  if (req.method === "OPTIONS") {
//    res.end();
//    return false;
//  }
//  res.socket.server.ws ||= (() => {
//    res.socket.server.on("upgrade", function (request, socket, head) {
//      wsServer.handleUpgrade(request, socket, head, function (ws) {
//        wsServer.emit("connection", ws);
//      });
//    });
//    serverCleanup = useServer({ schema }, wsServer);
//    return wsServer;
//  })();
//
//  const h = await getHandler();
//
//  await h(req, res);
//});
//
//export const config = {
//  api: {
//    bodyParser: false,
//  },
//};
//
////const wsServer = new WebSocketServer({
////  port: 3000,
////  path: "/api/subg",
////  headers: { "echo-protocol": true },
////});
//
////const graphqlWithSubscriptionHandler = (req, res, next) => {
////  if (!res.socket.server.apolloServer) {
////    console.log(`* apolloServer first use *`);
////
////    apolloServer.installSubscriptionHandlers(res.socket.server);
////    const handler = apolloServer.createHandler({ path: "/api/subg" });
////    res.socket.server.apolloServer = handler;
////  }
////
////  return res.socket.server.apolloServer(req, res, next);
////};
//
////export default graphqlWithSubscriptionHandler;
////export default cors(async function handler(req, res) {
////  console.log("in sub cores");
////  if (req.method === "OPTIONS") {
////    res.end();
////    return false;
////  }
////  await startServer;
////  //const PORT = 3000;
////
////  //wsServer.listen(PORT, () => {
////  //  console.log(
////  //    `Server is now running on http://localhost:${PORT}${apolloServer.graphqlPath}`
////  //  );
////  //});
////  useServer({ schema }, wsServer);
////  await apolloServer.createHandler({
////    path: "/api/subg",
////  })(req, res);
////});
////
//
