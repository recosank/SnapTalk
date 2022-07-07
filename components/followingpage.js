import React from "react";
import Image from "next/image";
import profile from "../images/profile.jpg";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

const Get_FUser = gql`
  query getfposts {
    getFl
  }
`;
const FollowingPage = ({ data, c }) => {
  const { loading, error, data: qd } = useQuery(Get_FUser);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }
  if (qd) {
    console.log(qd);
  }

  return (
    <div className="z-30 flex items-center justify-center w-full h-full bg-black/50 absolute top-0 left-0 ">
      <div className="w-1/6 bg-white border-2 rounded-xl h-2/6">
        <div className="flex justify-between p-2 h-12 border-b">
          <button className="text-center text-md grow font-bold">
            Following{" "}
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
            onClick={c}
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="overflow-scroll h-5/6 overscroll-y-contain">
          {data.map((i, k) => {
            return (
              <div
                key={k}
                className="flex px-3 py-1 items-center"
                onClick={(e) => {}}
              >
                <Image
                  src={profile}
                  width="30"
                  height="30"
                  className="rounded-full"
                />
                <div className="grow mx-3">
                  <p className="text-xs text-black tracking-wide">{i}</p>
                  <p className="text-xs text-gray-400 mt-0.2">{i}</p>
                </div>
                {qd.getFl.includes(i) ? (
                  <button className="text-xs border px-2 rounded-md p-1">
                    Remove
                  </button>
                ) : (
                  <button className="text-xs border px-2 rounded-md p-1">
                    Follow
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FollowingPage;
