import React from "react";
import { useEffect, useState } from "react";
import Header from "../../components/header";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import profile from "../../images/profile.jpg";
import { useMutation } from "@apollo/client";
import Link from "next/link";

const Get_Fl = gql`
  query getfl {
    getFl
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
const Index = () => {
  const [content, setcontent] = useState("");
  const [Rname, setRname] = useState("");
  const [sndmsg, { data: md, loading: ml, error: me }] =
    useMutation(Send_Message);
  const { loading, error, data } = useQuery(Get_Fl);
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
    console.log(Rname);
    console.log(content);
    sndmsg({
      variables: {
        receiver: Rname,
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
              <div className="flex gap-2 items-center bg-gray-900" key={k}>
                <Image
                  src={profile}
                  width="60"
                  height="60"
                  className="rounded-full"
                />
                <Link href={`direct/${user}`}>
                  <p className="text-white">{user}</p>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="w-8/12 border bg-lime-300">
          <div className="w-1/2 m-auto">
            <p className="text-white">send your message privatelly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
