import { ApolloServer } from "apollo-server-micro";
import resolvers from "../../graphql/resolvers";
import typeDefs from "../../graphql/schema";
import Cors from "micro-cors";
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
      if (typeof window === "undefined") {
        console.log("in if");
        console.log(req.headers);
        console.log(req.cookies);
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
        const u_id = authg(token);
        console.log(u_id);
        req.userId = u_id.name;
        console.log("done ctx");
        if (req.headers.referer === "http://localhost:3000/accounts/edit") {
          const ctx = {
            req: req,
            res: res,
          };

          return ctx;
        }
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
