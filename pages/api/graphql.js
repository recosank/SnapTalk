import { ApolloServer } from "apollo-server-micro";
import resolvers from "../../graphql/resolvers";
import typeDefs from "../../graphql/schema";
import Cors from "micro-cors";
import jwt from "jsonwebtoken";
import authg from "../../lib/auth";
import Router from "next/router";
const cors = Cors();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
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
        //console.log(req);
        console.log(req.userId);
        console.log("done ctx");

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
