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
      const data = await pool.query(
        `SELECT * FROM fanuser WHERE fname = '${args.fname}';`
      );
      return data.rows[0];
    },
    lg: async (_, __, ctx) => {
      const data = await pool.query(
        `SELECT * FROM fanuser WHERE fname = '${ctx.req.userId}';`
      );
      return data.rows[0];
    },
    users: async (_, args, ctx) => {
      const data = await pool.query("SELECT * FROM fanuser;");
      return data.rows;
    },
    searchUser: async (_, { subStr }, ctx) => {
      const data = await pool.query(
        `SELECT * FROM fanuser WHERE fname LIKE '%${subStr}%';`
      );
      return data.rows;
    },
    getFl: async (_, __, { userId }) => {
      const data = await pool.query(
        `SELECT following FROM fanuser WHERE fname='${userId}';`
      );
      return data.rows[0].following;
    },
    getFo: async (_, __, { userId }) => {
      const data = await pool.query(
        `SELECT follow FROM fanuser WHERE fname='${userId}';`
      );
      return data.rows[0].follow;
    },
    allposts: async () => {
      const data = await pool.query("SELECT * FROM fanpost;");
      return data.rows;
    },
    getcomment: async (_, { postuid }, { userId }) => {
      const data = await pool.query(
        `SELECT jsonb_array_elements(comments) as commt FROM fanpost WHERE puid = '${postuid}';`
      );
      return JSON.stringify(data.rows);
    },
    getmessages: async (_, { receiver }, { userId }) => {
      const data = await pool.query(
        `SELECT * FROM message WHERE sender = '${userId}' AND receiver = '${receiver}';`
      );
      return data.rows;
    },
    posts: async (_, args, context) => {
      const uData = await pool.query(
        `SELECT * FROM fanpost WHERE user_name = '${args.fname}';`
      );
      return uData.rows;
    },
  },
  Mutation: {
    addfuser: async (
      _,
      { fname, confirmPassword, pname, password },
      context
    ) => {
      //CREATE TABLE fanuser(fuid uuid DEFAULT uuid_generate_v4() PRIMARY KEY,fname varchar(50) UNIQUE not null,follow text[] DEFAULT '{}' , following text[] DEFAULT '{}',password varchar(500) not null);
      const existedUser = await pool.query(
        `SELECT fname FROM fanuser WHERE fname='${fname}';`
      );
      if (existedUser.rows.length > 0) {
        return "user alredy";
      }
      if (password !== confirmPassword) {
        return "password dosen't natch";
      }
      const hasedPasswd = await bcrypt.hash(password, 12);
      console.log("passwprdf");
      const user = await pool.query(
        `INSERT INTO fanuser(fname,pname,password) VALUES ('${fname}','${pname}','${hasedPasswd}') returning *;`
      );
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
    logfuser: async (_, { fname, password }, context) => {
      const existedUser = await pool.query(
        `SELECT * FROM fanuser WHERE fname='${fname}';`
      );
      if (existedUser.rows.length === 0) {
        return "no alredy";
      }
      const hasedPasswd = await bcrypt.compare(
        password,
        existedUser.rows[0].password
      );
      console.log(hasedPasswd);
      if (!hasedPasswd) {
        return "wrong auth";
      }
      const token = jwt.sign(
        { name: existedUser.rows[0].fname, _id: existedUser.rows[0].fuid },
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
        })
      );
      return existedUser.rows[0];
    },
    update_fuser: async (_, { isopen, pname, fname }, ctx) => {
      const user_Id = ctx.req.userId;
      if (fname != user_Id) {
        const existedUser = await pool.query(
          `SELECT fname FROM fanuser WHERE fname='${fname}';`
        );
        if (existedUser.rows.length > 0) {
          return "user alredy";
        }
      }
      const data = await pool.query(
        `UPDATE fanuser SET isopen = ${isopen},pname = '${pname}' ,fname = '${fname}' WHERE fname='${user_Id}' returning *;`
      );
      const token = jwt.sign(
        { name: data.rows[0].fname, _id: data.rows[0].fuid },
        SECRET,
        {
          expiresIn: "8h",
        }
      );
      ctx.res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          maxAge: 60 * 60,
          sameSite: "strict",
          path: "/",
          httpOnly: true,
          secure: true,
        })
      );
      return data.rows[0];
    },
    chgPass: async (_, { oldPassword, confirmPassword, password }, context) => {
      const user_Id = context.userId;
      const existedUser = await pool.query(
        `SELECT * FROM fanuser WHERE fname='${user_Id}';`
      );
      if (existedUser.rows.length === 0) {
        return "no alredy";
      }
      const hasedPasswd = await bcrypt.compare(
        oldPassword,
        existedUser.rows[0].password
      );
      if (!hasedPasswd) {
        return "wrong auth";
      }
      if (password !== confirmPassword) {
        return "password dosen't match";
      }
      const hasedNewPasswd = await bcrypt.hash(password, 12);
      const user = await pool.query(
        `UPDATE fanuser SET password = '${hasedNewPasswd}' WHERE fname = '${user_Id}' returning *;`
      );
      return user.rows[0];
    },
    addfpost: async (_, data, context) => {
      const user_Id = context.userId;
      const { title } = data;
      //CREATE TABLE fanpost(puid uuid DEFAULT uuid_generate_v4() primary key,title varchar(600) not null, user_name varchar(50) not null,FOREIGN KEY(user_name) REFERENCES fanuser(fname));
      const post = await pool.query(
        `INSERT INTO fanpost(title,user_name) VALUES ('${title}','${user_Id}') returning *;`
      );
      return post.rows[0];
    },
    addcomment: async (_, { postuid, content }, ctx) => {
      const user_Id = ctx.userId;
      //with comment_data as (select jsonb_array_elements(comments) ->> 'content' as comment , jsonb_array_elements(comments) ->> 'user_Id' as comment_user from fanpost) select * from comment_data  where comment_user = 'badgirl'
      const comment = await pool.query(
        `UPDATE fanpost SET comments = comments || '{"user_Id":"${user_Id}","content":"${content}"}'::jsonb WHERE puid = '${postuid}'  returning *;`
      );
      const data = {
        user: user_Id,
        content,
      };
      return data;
    },
    updateAddLike: async (_, { puid }, ctx) => {
      const user_Id = ctx.userId;
      const post = await pool.query(
        `UPDATE fanpost SET likes = array_append(likes,'${user_Id}') WHERE puid = '${puid}' returning *;`
      );
      return post.rows[0];
    },
    updateRemLike: async (_, { puid }, ctx) => {
      const user_Id = ctx.userId;
      const post = await pool.query(
        `UPDATE fanpost SET likes = array_remove(likes,'${user_Id}') WHERE puid = '${puid}'  returning *;`
      );
      return post.rows[0];
    },
    addfl: async (_, { fname }, context) => {
      const user_Id = context.userId;
      //CREATE OR REPLACE FUNCTION addfl(l VARCHAR(50),o VARCHAR(50)) RETURNS text[] AS $$ UPDATE fanuser SET following = array_append(following,o) WHERE fname = l returning *; UPDATE fanuser SET follow = array_append(follow,l) WHERE fname = o returning follow $$ LANGUAGE SQL;
      const post = await pool.query(`SELECT addfl('${user_Id}','${fname}');`);
      return JSON.stringify(post.rows[0].addfl);
    },
    remfl: async (_, { fname }, context) => {
      const user_Id = context.userId;
      //CREATE OR REPLACE FUNCTION remfl(l VARCHAR(50),o VARCHAR(50)) RETURNS text[] AS $$ UPDATE fanuser SET following = array_remove(following,o) WHERE fname = l returning *; UPDATE fanuser SET follow = array_remove(follow,l) WHERE fname = o returning follow $$ LANGUAGE SQL;
      const post = await pool.query(`SELECT remfl('${user_Id}','${fname}');`);
      return JSON.stringify(post.rows[0].remfl);
    },
    //sendmessage: async (_, { receiver, content }) => {
    //, { userId, pubsub }
    //console.log("in sendmessage");
    //  const data = await pool.query(
    //    `INSERT INTO message(content,sender,receiver) VALUES ('${content}','${userId}','${receiver}') returning *;`
    //  );
    //
    //  console.log(data.rows);
    //  pubsub.publish("NEW_MESSAGE", { newMessage: data.rows[0] });
    //  return data.rows[0];
    //},
  },
  //Subscription: {
  //  newMessage: {
  //    subscribe: async (ctx) => {
  //      //withFilter((_, __, req) => {
  //      //console.log(pubsub);
  //      console.log("checj ut iyt");
  //      //console.log(arg);
  //      console.log(ctx);
  //
  //      //return "yes";
  //      //  if (!userId) throw new AuthenticationError("Unauthenticated");
  //      //return pubsub.asyncIterator("NEW_MESSAGE");
  //      //},
  //      //({ newMessage }, _, { userId }) => {
  //      //  if (newMessage.sender === userId || newMessage.receiver === userId) {
  //      //    return true;
  //      //  }
  //      //
  //      //  return false;
  //    },
  //  },
  //},
};

export default resolvers;
