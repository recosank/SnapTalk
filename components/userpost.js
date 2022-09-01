import React from "react";
import Image from "next/image";
import def from "../images/def.jpg";
import profile from "../images/profile.jpg";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

const update_cmt = gql`
  mutation update_cmt($content: String!, $postuid: String!) {
    addcomment(content: $content, postuid: $postuid) {
      user
      content
    }
  }
`;
const Get_cmt = gql`
  query getcmt($postuid: String!) {
    getcomment(postuid: $postuid)
  }
`;
const Userpost = ({ data, l, c }) => {
  console.log("user post");
  const [cmmnt, setcmmnt] = useState("");
  const {
    loading: qloading,
    error: qerror,
    data: qdata,
  } = useQuery(Get_cmt, {
    variables: { postuid: data.puid },
  });
  let allCommnt = qdata && JSON.parse(qdata.getcomment);
  const [upCmt, { data: cd, loading: cl, error: ce }] = useMutation(update_cmt);
  const handlecmmnt = (e) => {
    e.preventDefault();
    upCmt({
      variables: {
        postuid: data.puid,
        content: cmmnt,
      },
    });
  };

  return (
    <div className="z-30 flex justify-center w-full overflow-hidden overscroll-none py-8 h-screen bg-black/50 absolute top-0 left-0 inset-0 ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 right-2 top-2 absolute"
        viewBox="0 0 20 20"
        fill="white"
        onClick={c}
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      <div className="w-3/5 flex bg-white h-full">
        <div className="w-3/5 border-2 bg-whtie relative h-full py-5">
          <Image src={def} className="" width="100" height="50" layout="fill" />
        </div>
        <div className="w-2/5 flex flex-col">
          <div className="flex mb-2 justify-between px-3 py-1 rounded-lg items-center">
            <div className="flex gap-2  items-center mt-1.5">
              <Image
                src={profile}
                width="38"
                height="38"
                className="rounded-full"
              />
              <Link href={`${data.user_name}`}>
                <p className="text-sm">{data.user_name}</p>
              </Link>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              strokeWidth={1}
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
          <div className="grow border-t">
            <div className="flex items-center gap-2 mt-2 px-4 p-2">
              <Image
                src={profile}
                width="38"
                height="38"
                className="rounded-full"
              />
              <p className="font-bold">{data.user_name}</p>
              <p>{data.title}</p>
            </div>
            <div
              className="overflow-scroll overscroll-contain"
              style={{ height: "37rem" }}
            >
              {allCommnt &&
                allCommnt.map((val, ind) => {
                  return (
                    <div
                      key={ind}
                      className="flex items-center gap-2 mt-2 px-4 p-2"
                    >
                      <Image
                        src={profile}
                        width="35"
                        height="35"
                        className="rounded-full"
                      />
                      <p className="font-bold">{val.commt.user_Id}</p>
                      <p>{val.commt.content}</p>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-3">
                {data.likes.includes(`${l}`) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="red"
                    onClick={(e) => handleRemLk(e)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 25 25"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    onClick={(e) => handleAddLk(e)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <p className="px-4 mt-2 pt-1 text-sm">
              Liked by <span className="font-bold">{data.likes.length}</span>
            </p>

            <p className="text-xs text-gray-400 px-4 my-2">1 DAY AGO</p>
            <div className="flex border rounded-lg p-3 items-center align-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <textarea
                type="text"
                placeholder="Add a comment..."
                className="flex-1 pl-3 text-sm focus:outline-none resize-none"
                rows="1"
                value={cmmnt}
                onChange={(e) => {
                  e.preventDefault();
                  setcmmnt(e.target.value);
                }}
              />
              <button
                onClick={(e) => handlecmmnt(e)}
                className="text-blue-500 font-bold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userpost;
