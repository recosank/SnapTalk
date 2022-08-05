import { useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation, useSubscription } from "@apollo/client";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import axios from "axios";

import request from "graphql-request";

const Add_FPost = gql`
  mutation addFPost($title: String!) {
    addfpost(title: $title) {
      title
      user_name
      puid
      likes
    }
  }
`;
const Get_FPost = `
  {
   allposts {
      title
      likes
      user_name
    }
  }`;

const Post = () => {
  const fetcher = (query) => request("/api/graphql", query);
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { data, error } = useSWR(Get_FPost, fetcher);
  console.log("swr data");
  let tl = [];
  console.log(data);
  if (data) {
    tl = data.allposts;
  }
  console.log(error);

  const init = { title: "" };
  const [pInfo, setpInfo] = useState(init);

  const chgUserData = (e) => {
    e.preventDefault();
    setpInfo({ ...pInfo, [e.target.name]: e.target.value });
  };
  const [addpost, { data: md, loading: ml, error: me }] =
    useMutation(Add_FPost);
  const handleaccount = (e) => {
    e.preventDefault();

    addpost({ variables: { title: pInfo.title } });
  };
  console.log(pInfo);

  if (ml) {
    return <p>loading</p>;
  }
  if (md) {
    console.log(md);

    if (data) {
      tl.push(md.addfpost);
    }
  }
  if (me) {
    console.log(me);
  }
  return (
    <div className="flex justify-center flex-col items-center">
      <form
        action="/api/adduser"
        encType="multipart/form-data"
        className="border-4 mt-20 space-y-4 p-4"
        method="POST"
        onSubmit={handleaccount}
      >
        <div className="flex flex-col">
          <label className="text-xs ">title</label>
          <input
            type="text"
            placeholder="title"
            className="border-2 p-0.5 text-sm"
            value={pInfo.title}
            onChange={(e) => chgUserData(e)}
            name="title"
          />
        </div>

        <button className="border-2 " type="submit">
          boooom !!!
        </button>
      </form>
      {data &&
        tl.map((p, key) => {
          return <p key={key}>{p.title}</p>;
        })}
    </div>
  );
};

export default Post;
