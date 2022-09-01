import { ApolloServer } from "apollo-server-micro";
import resolvers from "../../graphql/resolvers";
import typeDefs from "../../graphql/schema";
import Cors from "micro-cors";
import authg from "../../lib/auth";

const cors = Cors();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  context: ({ req, res }) => {
    if (
      req.headers.referer === "http://localhost:3000/signup" ||
      req.headers.referer === "http://localhost:3000/login"
    ) {
      return res;
    } else {
      if (typeof window === "undefined") {
        let token = "";
        if (!req.headers.authorization) {
          token = req.headers.cookie !== "" && req.headers.cookie.slice(6);
        } else {
          token =
            req.headers.authorization !== ""
              ? req.headers.authorization
              : req.cookies.token;
        }
        const u_id = authg(token);
        req.userId = u_id.name;
        if (req.headers.referer === "http://localhost:3000/accounts/edit") {
          const ctx = {
            req: req,
            res: res,
          };
          return ctx;
        }
        console.log("done");
        return req;
      }

      const token = req.cookies.token;
      const u_id = authg(token);
      req.userId = u_id._id;
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
