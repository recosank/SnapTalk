import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import profile from "../images/profile.jpg";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import UserSP from "./userSP";
import chat from "../images/chat.svg";

const Get_Su = gql`
  query getsu($subStr: String!) {
    searchUser(subStr: $subStr) {
      fname
      pname
    }
  }
`;

const Header = () => {
  const router = useRouter();
  const [sUser, setsUser] = useState("");
  const [openSearch, setopenSearch] = useState(false);
  const [isLogin, setisLogin] = useState(false);
  const [login_user, setlogin_user] = useState("");
  const [focu, setfocu] = useState("");
  const [adfl, { loading: qloading, error: qerror, data: qdata }] =
    useLazyQuery(Get_Su);
  const handleSearch = () => {
    if (sUser != "") {
      setopenSearch(true);
      adfl({
        variables: { subStr: sUser },
      });
    } else {
      setopenSearch(false);
    }
  };

  useEffect(() => {
    const loginUser = JSON.parse(localStorage.getItem("fantaUser"));
    loginUser && setisLogin(true);
    if (loginUser) {
      setlogin_user(loginUser);
    }
  }, [isLogin]);
  return (
    <div className="flex justify-center gap-56 bg-white align-center items-center border shadow-xs ">
      <p
        className="font-semibold antialiased text-xl cursor-pointer"
        onClick={(e) => router.push("/")}
      >
        ƒɑղԵɑցɾɑʍ
      </p>
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
          className="bg-zinc-100 text-sm w-52 focus:outline-none "
          name="headSearch"
          value={sUser}
          onChange={(e) => {
            e.preventDefault();
            setsUser(e.target.value);
          }}
          onFocus={(e) => {
            e.preventDefault();
            setopenSearch(true);
          }}
          onKeyUp={handleSearch}
        />
        {openSearch != "" && (
          <div className="absolute  max-h-60 top-14 z-40 left-1/3 ml-28 w-1/6 bg-white overflow-scroll overscroll-y-contain">
            {openSearch &&
              qdata &&
              qdata.searchUser.map((i, key) => {
                return <UserSP key={key} data={i} />;
              })}
          </div>
        )}
      </div>
      {isLogin ? (
        <div className="flex gap-5 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            onClick={(e) => router.push("/")}
          >
            <path d="M8,1L1,6v9h5v-4c0-1.105,0.895-2,2-2s2,0.895,2,2v4h5V6L8,1z"></path>{" "}
          </svg>

          <Image
            src={chat}
            width="37"
            height="37"
            className="text-black text-center"
            onClick={(e) => {
              e.preventDefault();
              setfocu("home");
              console.log(focu);
              router.push("/direct");
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 rounded-lg border-2 ${
              focu === "add" && "bg-black"
            } border-black`}
            fill="none"
            viewBox="0 0 24 24"
            stroke={`${focu === "add" ? "white" : "currentColor"}`}
            strokeWidth={2}
            onClick={(e) => {
              e.preventDefault();
              setfocu("add");
              console.log("kaka");
              router.push("/addPost");
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
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
            onClick={(e) => {
              router.push(`/${login_user.f}`);
            }}
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
