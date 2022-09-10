import { useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import bfb from "../images/bfb.png";
import styles from "../styles/Home.module.css";
import fan from "../images/fan.jpg";

const Add_FUser = gql`
  mutation addFUser(
    $fname: String!
    $pname: String!
    $confirmPassword: String!
    $password: String!
  ) {
    addfuser(
      fname: $fname
      pname: $pname
      confirmPassword: $confirmPassword
      password: $password
    ) {
      fname
    }
  }
`;

const Signup = () => {
  const init = {
    fname: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    emailNum: "",
  };
  const [uInfo, setuInfo] = useState(init);
  const router = useRouter();

  const chgUserData = (e) => {
    e.preventDefault();
    setuInfo({ ...uInfo, [e.target.name]: e.target.value });
  };
  const [adduser, { data, loading, error }] = useMutation(Add_FUser);
  const handleaccount = (e) => {
    e.preventDefault();
    adduser({
      variables: {
        fname: uInfo.fname,
        pname: uInfo.fullName,
        password: uInfo.password,
        confirmPassword: uInfo.confirmPassword,
      },
    });
  };

  if (loading) {
    return (
      <div class="flex justify-center h-screen items-center">
        <div
          class="spinner-border animate-spin border-black inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span class="visually-hidden"></span>
        </div>
      </div>
    );
  }
  if (data) {
    if (data.addfuser.fname === uInfo.fname) {
      const d = { f: uInfo.fname, p: uInfo.fullName };
      localStorage.setItem("fantaUser", JSON.stringify(d));
      router.push("/");
    }
  }
  if (error) {
    console.log(error);
  }
  return (
    <div className="flex justify-center flex-col items-end bg-zinc-50 h-screen">
      <Image src={fan} layout="fill" className="z-10" />
      <div className={`bg-black z-30 mr-56 ${styles.signupCard}`}>
        <div className="text-center my-6">
          <p
            className="font-semibold antialiased text-sky-400 tracking-wider text-2xl"
            onClick={(e) => router.push("/")}
          >
            𝓢𝓷𝓪𝓹𝓣𝓪𝓵𝓴
          </p>
        </div>
        <p className="text-center text-md tracking-wide px-10 text-zinc-500 font-bold">
          Sign up to see photos and videos from your friends.
        </p>
        <button className="w-4/5 flex p-2 justify-center gap-2 rounded-md mt-4 ml-8 bg-black text-white font-bold text-sm">
          <Image src={bfb} width="20" height="15" />
          Log in with Facebook
        </button>
        <div className={`${styles.divider} mx-7 mt-4 text-sm text-zinc-500 `}>
          OR
        </div>
        <form
          action="/api/adduser"
          encType="multipart/form-data"
          className="mt-4 space-y-2 px-9 mb-14"
          method="POST"
          onSubmit={(e) => handleaccount(e)}
        >
          <div className="flex flex-col">
            <input
              type="text"
              className="border-2  text-xs p-2 rounded-md bg-zinc-50"
              value={uInfo.emailNum}
              placeholder="Mobile Number or Email"
              onChange={(e) => chgUserData(e)}
              name="emailNum"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              className="border-2 text-xs p-2 rounded-md bg-zinc-50"
              value={uInfo.fullName}
              placeholder="Full Name"
              onChange={(e) => chgUserData(e)}
              name="fullName"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              className="border-2 text-xs p-2 rounded-md bg-zinc-50"
              value={uInfo.fname}
              placeholder="Username"
              onChange={(e) => chgUserData(e)}
              name="fname"
            />
          </div>

          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="border-2 text-xs p-2 rounded-md bg-zinc-50"
              value={uInfo.password}
              onChange={(e) => chgUserData(e)}
            />
          </div>
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              className="border-2 text-xs p-2 rounded-md bg-zinc-50"
              value={uInfo.confirmPassword}
              onChange={(e) => chgUserData(e)}
            />
          </div>
          <p className="text-xs text-center py-2.5 tracking-wide text-zinc-500">
            People who use our service may have uploaded your contact
            information to Instagram.
            <span className="text-zinc-800"> Learn More</span>
          </p>
          <p className="text-xs text-center pb-2.5 tracking-wide text-zinc-500">
            By signing up, you agree to our{" "}
            <span className="text-zinc-800">
              {" "}
              Terms , Data Policy and Cookies Policy .
            </span>
          </p>

          <button
            className="w-full bg-black font-bold py-1 rounded-md text-white"
            type="submit"
          >
            Sign up
          </button>
        </form>
      </div>
      <div
        className={`p-5 border-t border-white z-40 bg-black mr-56 text-center ${styles.signupCard}`}
      >
        <p className="text-white">
          Have an account?
          <span
            className="text-lime-400 pl-2"
            onClick={(e) => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
