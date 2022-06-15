import { connectToDatabase } from "../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const { pool } = connectToDatabase();
const SECRET =
  "asjkdfa5s4df658ar64f3a54f5425253456544@#%@%^%$^!#$%@#zbsdfbsdfbdsafgb3847tw4y8hgf";

const resolvers = {
  Query: {
    user: async (_, args, context) => {
      console.log("in query 1");
      //const user_Id = context.userId;

      console.log(args);

      const data = await pool.query(
        `SELECT * FROM fanuser WHERE fname = '${args.fname}';`
      );
      console.log("user data");
      console.log(data.rows);

      return data.rows[0];
    },
    users: async (_, args, ctx) => {
      console.log("inusers");
      console.log(ctx.userId);
      const data = await pool.query("SELECT * FROM fanuser;");
      console.log(data.rows[0]);

      return data.rows;
    },
    getFl: async (_, __, { userId }) => {
      console.log("in getfl");
      const data = await pool.query(
        `SELECT following FROM fanuser WHERE fname='${userId}';`
      );
      console.log(data.rows[0].following);
      return data.rows[0].following;
    },
    allposts: async () => {
      console.log("inposts");

      const data = await pool.query("SELECT * FROM fanpost;");
      console.log(data.rows[0]);

      return data.rows;
    },
    getmessages: async (_, args, { userId }) => {
      console.log("in get message");
      console.log(args);
      const data = await pool.query(
        `SELECT * FROM message WHERE sender = '${userId}' OR receiver = '${userId}';`
      );
      console.log(data.rows);
      return data.rows;
    },
    posts: async (_, args, context) => {
      console.log("asdfhwew");
      console.log("in query 2");

      //console.log(context.userId);
      const uData = await pool.query(
        `SELECT * FROM fanpost WHERE user_name = '${args.fname}';`
      );
      console.log(uData.rows);
      //const user_Id = context.userId;
      //
      //const data = await pool.query(
      //  `SELECT * FROM fanpost WHERE user_uid = '${user_Id}';`
      //);
      //console.log(data.rows);

      return uData.rows;
    },
  },
  Mutation: {
    addfuser: async (_, { fname, confirmPassword, password }, context) => {
      console.log("hwew");
      //CREATE TABLE fanuser(fuid uuid DEFAULT uuid_generate_v4() PRIMARY KEY,fname varchar(50) UNIQUE not null,follow text[] DEFAULT '{}' , following text[] DEFAULT '{}',password varchar(500) not null);
      console.log(context);

      console.log(confirmPassword);
      const existedUser = await pool.query(
        `SELECT fname FROM fanuser WHERE fname='${fname}';`
      );

      console.log(existedUser);

      if (existedUser.rows.length > 0) {
        console.log("alredy user");
        return "user alredy";
      }
      if (password !== confirmPassword) {
        console.log("not pass");
        return "password dosen't natch";
      }
      const hasedPasswd = await bcrypt.hash(password, 12);
      console.log(hasedPasswd);

      const user = await pool.query(
        `INSERT INTO fanuser(fname,password,follow,following) VALUES ('${fname}','${hasedPasswd}','{}','{}') returning *;`
      );
      console.log(user);

      const token = jwt.sign(
        { name: user.rows[0].fname, _id: user.rows[0].fuid },
        SECRET,
        {
          expiresIn: "8h",
        }
      );
      context.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          maxAge: 60 * 60,
          sameSite: "strict",
          path: "/",
          httpOnly: true,
          secure: true,
        })
      );

      return user.rows[0];
    },
    //logfuser: async (_, { fname,password },context) => {
    //  console.log('hwew');
    //
    //  console.log(context);
    //
    //
    //  const existedUser = await pool.query(`SELECT fname FROM fanuser WHERE fname='${fname}';`);
    //
    //  console.log(existedUser);
    //
    //  if (existedUser.rows.length == 0) {
    //    console.log("no user");
    //    return "no alredy"
    //  }
    // const hasedPasswd = await bcrypt.compare(password, existedUser.rows[0].password);
    //
    //  console.log(hasedPasswd);
    //
    //
    //
    //  const token = jwt.sign({ name: existedUser.rows[0].fname, _id: existedUser.rows[0].fuid }, SECRET, {
    //    expiresIn: "8h",
    //});
    //context.setHeader(
    //  "Set-Cookie",
    //  cookie.serialize("token", token, {
    //    maxAge: 60 * 60,
    //    sameSite: "strict",
    //    path: "/",
    //    httpOnly: true,
    //  })
    //);
    //
    //
    //  return user.rows[0]
    //},
    addfpost: async (_, { title }, context) => {
      console.log("hwew");

      console.log(context.userId);
      const user_Id = context.userId;
      //CREATE TABLE fanpost(puid uuid DEFAULT uuid_generate_v4() primary key,title varchar(600) not null, user_name varchar(50) not null,FOREIGN KEY(user_name) REFERENCES fanuser(fname));

      const post = await pool.query(
        `INSERT INTO fanpost(title,user_name) VALUES ('${title}','${user_Id}') returning *;`
      );
      console.log(post);

      console.log(post.rows[0]);

      return post.rows[0];
    },
    updatefpost: async (_, { title, fuid }) => {
      console.log("hwew");

      const post = await pool.query(
        `UPDATE fanpost SET title='${title}' WHERE user_uid = '${fuid}' returning *;`
      );
      console.log(post);

      console.log(post.rows[0]);

      return post.rows[0];
    },
    addfl: async (_, { fname }, context) => {
      console.log("followadd");

      console.log(context.userId);
      const user_Id = context.userId;
      //CREATE OR REPLACE FUNCTION addfl(l VARCHAR(50),o VARCHAR(50)) RETURNS text[] AS $$ UPDATE fanuser SET following = array_append(following,o) WHERE fname = l returning *; UPDATE fanuser SET follow = array_append(follow,l) WHERE fname = o returning follow $$ LANGUAGE SQL;
      const post = await pool.query(`SELECT addfl('${user_Id}','${fname}');`);
      console.log(post);

      console.log(post.rows[0]);

      return post.rows[0].addfl;
    },
    remfl: async (_, { fname }, context) => {
      console.log("following");

      console.log(context.userId);
      const user_Id = context.userId;
      //CREATE OR REPLACE FUNCTION remfl(l VARCHAR(50),o VARCHAR(50)) RETURNS text[] AS $$ UPDATE fanuser SET following = array_remove(following,o) WHERE fname = l returning *; UPDATE fanuser SET follow = array_remove(follow,l) WHERE fname = o returning follow $$ LANGUAGE SQL;

      const post = await pool.query(`SELECT remfl('${user_Id}','${fname}');`);
      console.log(post);

      console.log(post.rows[0]);

      return post.rows[0].adddffflll;
    },
    sendmessage: async (_, { receiver, content }, { userId }) => {
      console.log("in sendmessage");

      console.log(userId);
      const data = await pool.query(
        `INSERT INTO message(content,sender,receiver) VALUES ('${content}','${userId}','${receiver}') returning *;`
      );
      console.log(data.rows);
      return data.rows[0];
    },
  },
};

export default resolvers;
