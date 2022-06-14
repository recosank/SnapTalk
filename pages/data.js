import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import profile from "../images/profile.jpg";

const Get_FPost = gql`
  query getfposts {
    posts {
      title
      user_uid
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(Get_FPost);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }
  if (data) {
    console.log(data.posts);
  }

  return (
    <div className="border-2 container w-1/2 mx-auto mt-10">
      <div className="flex border">
        <div className="border text-center w-2/6 p-20">
          <Image
            src={profile}
            className="rounded-full"
            width="150"
            height="150"
          />
        </div>
        <div></div>
      </div>
      {data.posts.map((i) => {
        return <p>{i.title}</p>;
      })}
    </div>
  );
}
