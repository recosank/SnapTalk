import { ApolloServer } from "apollo-server-micro";
import resolvers from "../../graphql/resolvers";
import typeDefs from "../../graphql/schema";
import Cors from "micro-cors";
import jwt from "jsonwebtoken";
import authg from "../../lib/auth";
import Router from "next/router";
import { WebSocketServer } from "ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

const cors = Cors();
const pubbsubb = new PubSub();
const schema = makeExecutableSchema({ typeDefs, resolvers });
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  subscriptions: {
    onConnect: (cnxnParams, webSocket, cnxnContext) => {
      console.log(cnxnParams);
      console.log("in subbbbb");
      console.log(webSocket);
      console.log(cnxnContext);
      const cookie = webSocket.upgradeReq.headers.cookie;
      const userId = getCookie(cookie, "userId");
      return {
        loginUser: userId,
      };
    },
  },

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
        const token =
          req.headers.authorization !== ""
            ? req.headers.authorization
            : req.cookies.token;
        console.log(token);
        if (!token) {
          Router.push("/signup");
        }
        const u_id = authg(token);
        console.log("done token");
        console.log(u_id);
        req.userId = u_id.name;
        console.log("done ctx");
        req.pubsub = pubbsubb;
        return req;
      }

      console.log("out ssr");

      const token = req.cookies.token;
      console.log(token);

      const u_id = authg(token);
      console.log(u_id);
      req.userId = u_id._id;
      //console.log(req);
      console.log(req.userId);

      return req;
    }
  },
});

const wsServer = new WebSocketServer({
  port: 3000,
  path: "/api/graphql",
});
const serverCleanup = useServer({ schema }, wsServer);
const startServer = apolloServer.start();

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
