import React, { useEffect, useState } from "react";
import Image from "next/image";
import instlogo from "../images/instlogo.png";
import { useRouter } from "next/router";
import profile from "../images/profile.jpg";

const Header = () => {
  const router = useRouter();
  const [isLogin, setisLogin] = useState(false);

  useEffect(() => {
    const loginUser = localStorage.getItem("fantaUser");
    loginUser && setisLogin(true);
  }, [isLogin]);
  return (
    <div className="flex justify-center gap-56 bg-white align-center items-center border shadow-xs ">
      <Image
        src={instlogo}
        width="110"
        height="40"
        onClick={(e) => router.push("/")}
      />
      <div className="flex border h-9 align-center items-center gap-2 p-3 my-3 rounded-lg bg-zinc-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-slate-400 "
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="bg-zinc-100 text-lg w-52"
          name="headSearch"
        />
      </div>
      {isLogin ? (
        <div className="flex gap-5 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            viewBox="0 0 20 20"
            fill="currentColor"
            onClick={(e) => router.push("/")}
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            onClick={(e) => router.push("/direct")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 rounded-md border-2 border-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6  rounded-full p-0.5 border-2 border-black"
            fill="none"
            fontSize="xs"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <Image
            src={profile}
            className="rounded-full"
            width="30"
            height="30"
          />
        </div>
      ) : (
        <div>
          <button className="px-2 py-1 text-sm text-center bg-cyan-500 text-white font-semibold  rounded-sm">
            Log In
          </button>
          <button
            className="p-2 text-md text-cyan-600 rounded-md ml-2"
            onClick={() => {
              router.push("signup");
            }}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
//<div>
//          <button
//            className="p-2 text-md text-cyan-600 rounded-md ml-2"
//            onClick={() => {
//              router.push("signup");
//            }}
//          >
//            Log Out
//          </button>
//        </div>
