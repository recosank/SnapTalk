import { useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import bfb from "../images/bfb.png";
import styles from "../styles/Home.module.css";
import fan from "../images/fan.jpg";

const Log_FUser = gql`
  mutation logFUser($fname: String!, $password: String!) {
    logfuser(fname: $fname, password: $password) {
      fname
    }
  }
`;

const Login = () => {
  const router = useRouter();
  const init = {
    fname: "",
    password: "",
  };
  const [uInfo, setuInfo] = useState(init);

  const chgUserData = (e) => {
    e.preventDefault();
    setuInfo({ ...uInfo, [e.target.name]: e.target.value });
  };
  const [loguser, { data, loading, error }] = useMutation(Log_FUser);
  const handleaccount = (e) => {
    e.preventDefault();
    loguser({
      variables: {
        fname: uInfo.fname,
        password: uInfo.password,
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
    if (data.logfuser.fname === uInfo.fname) {
      const fullName = "snowman";
      const d = { f: uInfo.fname, p: fullName };
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
        <div className="text-center my-10">
          <p
            className="font-semibold antialiased tracking-wider text-sky-400 text-2xl"
            onClick={(e) => router.push("/")}
          >
            𝓢𝓷𝓪𝓹𝓣𝓪𝓵𝓴
          </p>
        </div>
        <form
          encType="multipart/form-data"
          className="mt-4 px-9"
          method="POST"
          onSubmit={handleaccount}
        >
          <div className="flex flex-col my-2">
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

          <button
            className="w-full bg-black font-bold py-1 mt-4 rounded-md text-white"
            type="submit"
          >
            Log In
          </button>
        </form>

        <div className={`${styles.divider} mx-7 mt-5 text-sm text-zinc-500 `}>
          OR
        </div>
        <button className="w-4/5 flex p-2 justify-center gap-2 mt-4 ml-8  text-white font-bold text-sm">
          <Image src={bfb} width="20" height="15" />
          Log in with Facebook
        </button>
        <button className="text-xs text-lime-400 ml-32 my-4">
          Forget password
        </button>
      </div>
      <div
        className={`p-5 border-t border-white z-40 bg-black mr-56 text-white text-center ${styles.signupCard}`}
      >
        <p>
          Don't have an account?{" "}
          <span
            className="text-lime-400 ml-2"
            onClick={(e) => router.push("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
