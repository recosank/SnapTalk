import { useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import instlogo from "../images/instlogo.png";
import Image from "next/image";
import bfb from "../images/bfb.png";
import styles from "../styles/Home.module.css";

const Log_FUser = gql`
  mutation logFUser($fname: String!, $password: String!) {
    logfuser(fname: $fname, password: $password) {
      fname
    }
  }
`;

const Login = () => {
  const init = {
    fname: "",
    password: "",
  };
  const [uInfo, setuInfo] = useState(init);
  const router = useRouter();

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
    return <p>loading</p>;
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
    <div className="flex justify-center flex-col items-center bg-zinc-50 h-screen">
      <div className={`border-2 bg-white ${styles.signupCard}`}>
        <div className="text-center mt-10">
          <Image src={instlogo} width="190" height="70" className="m-3" />
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
        <button className="w-4/5 flex p-2 justify-center gap-2 mt-4 ml-8  text-blue-700 font-bold text-sm">
          <Image src={bfb} width="20" height="15" />
          Log in with Facebook
        </button>
        <button className="text-xs text-blue-700 ml-32 my-4">
          Forget password
        </button>
      </div>
      <div
        className={`mt-3 p-5 border-2 text-sm bg-white text-center ${styles.signupCard}`}
      >
        <p>
          Don't have an account?{" "}
          <span
            className="text-blue-900"
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
