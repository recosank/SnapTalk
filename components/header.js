import React, { useEffect, useState } from "react";
import Image from "next/image";
import instlogo from "../images/instlogo.png";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const [isLogin, setisLogin] = useState(false);

  useEffect(() => {
    const loginUser = localStorage.getItem("fantaUser");
    loginUser && setisLogin(true);
  }, [isLogin]);
  return (
    <div className="flex justify-center gap-56 bg-white align-center items-center border shadow-xs ">
      <Image src={instlogo} width="110" height="40" />
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
        <div>
          <button
            className="p-2 text-md text-cyan-600 rounded-md ml-2"
            onClick={() => {
              router.push("signup");
            }}
          >
            Log Out
          </button>
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
