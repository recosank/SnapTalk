import { ApolloServer } from "apollo-server-micro";
import resolvers from "../../graphql/resolvers";
import typeDefs from "../../graphql/schema";
import Cors from "micro-cors";
import authg from "../../lib/auth";
import Router from "next/router";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { Disposable } from "graphql-ws";
import { WebSocketServer } from "ws";
import { PubSub } from "graphql-subscriptions";

const cors = Cors();
//const pubsub = new PubSub();
//let serverCleanup = Disposable | null;
//const schema = makeExecutableSchema({ typeDefs, resolvers });
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  //schema,
  csrfPrevention: true,
  //introspection: true,
  //subscriptions: {
  //  path: "/api/graphql",
  //
  //  onConnect: (tt) => console.log(tt),
  //  onDisconnect: () => console.log("disconnected"),
  //},
  context: ({ req, res }) => {
    console.log("in cxt");

    if (
      req.headers.referer === "http://localhost:3000/signup" ||
      req.headers.referer === "http://localhost:3000/login"
    ) {
      console.log("signup");

      return res;
    } else {
      //console.log(req.cookies);
      if (typeof window === "undefined") {
        console.log("in ifffffff");

        console.log(req.headers);
        console.log(req.cookies);
        //if (req.socket.server.ws) {
        //  console.log("done ctx");
        //  console.log(pubsub);
        //  req.pubsub = pubsub;
        //
        //  return { p: pubsub, l: "lo" };
        //}
        //console.log("no ws");
        let token = "";

        if (!req.headers.authorization) {
          console.log("another if");
          token = req.headers.cookie !== "" && req.headers.cookie.slice(6);
        } else {
          token =
            req.headers.authorization !== ""
              ? req.headers.authorization
              : req.cookies.token;
          console.log(token);
        }
        //if (!token) {
        //  Router.push("/signup");

        const u_id = authg(token);
        console.log(u_id);
        req.userId = u_id.name;
        console.log("done ctx");
        //req.pubsub = pubbsubb;
        return req;
      }
      console.log("out ssr");
      const token = req.cookies.token;
      const u_id = authg(token);
      req.userId = u_id._id;
      console.log(req.userId);

      return req;
    }
  },
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
});
const startServer = apolloServer.start();
//const getHandler = async () => {
//  await startServer;
//  return apolloServer.createHandler({
//    path: "/api/graphql",
//  });
//};
//const wsServer = new WebSocketServer({
//  noServer: true,
//});
//
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

export default cors(async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;

  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
