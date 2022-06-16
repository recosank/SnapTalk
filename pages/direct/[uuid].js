import React from "react";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import profile from "../../images/profile.jpg";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import Link from "next/link";

const Get_Fl = gql`
  query getfl($receiver: String!) {
    getFl
    getmessages(receiver: $receiver) {
      content
      sender
      receiver
    }
  }
`;
const Send_Message = gql`
  mutation msg($receiver: String!, $content: String!) {
    sendmessage(receiver: $receiver, content: $content) {
      content
      sender
      receiver
    }
  }
`;
const chataccount = () => {
  const [content, setcontent] = useState("");
  const router = useRouter();
  const [sndmsg, { data: md, loading: ml, error: me }] =
    useMutation(Send_Message);
  const { loading, error, data } = useQuery(Get_Fl, {
    variables: { receiver: router.query.uuid },
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }
  if (data) {
    console.log(data);
  }

  console.log(md);
  const sndMsg = (e) => {
    e.preventDefault();
    sndmsg({
      variables: {
        receiver: router.query.uuid,
        content: content,
      },
    });
  };

  return (
    <div className="bg-gray-50">
      <Header />
      <div className="flex mt-7 mx-auto w-1/2 h-screen bg-white">
        <div className="w-4/12 border">
          {data.getFl.map((user, k) => {
            return (
              <div
                className={`flex gap-2 items-center ${
                  user === router.query.uuid ? "bg-black" : "bg-gray-900"
                }`}
                key={k}
              >
                <Image
                  src={profile}
                  width="60"
                  height="60"
                  className="rounded-full"
                />
                <Link href={`${user}`}>
                  <p className="text-white">{user}</p>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="w-8/12 border bg-lime-300">
          <div className="w-1/2 m-auto">
            <p className="text-white">send your message privatelly</p>
            <input
              type="text"
              value={content}
              onChange={(e) => setcontent(e.target.value)}
              name="content"
            />
            <button type="submit" onClick={(e) => sndMsg(e)}>
              snd now
            </button>
          </div>
          {data.getmessages.map((msg, k) => {
            return <p key={k}>{msg.content}</p>;
          })}
        </div>
      </div>
    </div>
  );
};

export default chataccount;
