import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import authg from "../lib/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import profile from "../images/profile.jpg";
import { initializeApollo } from "../lib/apollo";
import HPosts from "../components/posts";
import { useApolloClient } from "@apollo/client";

const Get_FUser = gql`
  query getfposts {
    users {
      fname
    }
    getFl
    allposts {
      title
      puid
      likes
      user_name
    }
  }
`;
const Get_pUser = gql`
  query getfposts {
    allposts {
      title
      puid
      likes
      user_name
    }
  }
`;
export default function Home(props) {
  const router = useRouter();
  const [login_user, setlogin_user] = useState({});
  let client = useApolloClient();
  let homeData = client.cache.data.data.ROOT_QUERY;
  useEffect(() => {
    const local =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("fantaUser"))
        : "";
    setlogin_user(local);
  }, []);

  return (
    <div className="w-full bg-slate-50">
      <Header />
      <div className={`flex mt-7 ${styles.homeCard} mx-auto`}>
        <div className="mr-10 w-7/12">
          {homeData.getFl.length != 0 && (
            <div
              className={`flex p-2 w-full bg-white border rounded-lg ${styles.hdnscrollbar} overflow-x-auto overscroll-x-none`}
            >
              {homeData.getFl.map((user, key) => {
                return (
                  <div key={key} className="text-center mr-2 w-1/5">
                    <Image
                      src={profile}
                      layout="fixed"
                      width="60"
                      height="60"
                      className="rounded-full"
                    />
                    <p className="text-center text-xs">
                      {user.length >= 9 ? user.slice(0, 9) + "..." : user}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-5">
            {homeData.allposts.map((post, key) => {
              return <HPosts data={post} user={login_user.f} key={key} />;
            })}
          </div>
        </div>
        <div className="w-5/12 h-screen">
          <div
            className="flex items-center"
            onClick={(e) => {
              router.push(`/${login_user.f}`);
            }}
          >
            <Image
              src={profile}
              width="60"
              height="60"
              className="rounded-full"
            />
            <div className="grow mx-3">
              <p className="text-sm text-black tracking-wide">{login_user.f}</p>
              <p className="text-md text-gray-400 mt-0.5">{login_user.p}</p>
            </div>
            <button className="text-xs text-emerald-600">switch</button>
          </div>
          <div className="mt-3 text-center">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Suggestions For You</p>
              <p className="text-xs">See All</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps = async (ctx) => {
  const { req } = ctx;
  if (req?.headers.cookie) {
    let initialState;
    const apolloClient = await initializeApollo(
      (initialState = null),
      (ctx = ctx)
    );
    console.log("in ssr");
    try {
      await apolloClient.query({
        query: Get_FUser,
        //variables: { code: req.headers.cookie },
      });
      return {
        props: { initialApolloState: await apolloClient.cache.extract() },
      };
    } catch (error) {
      console.log("home error");
      console.log(error);
      //const gqlError = error.graphQLErrors[0];
      //if (gqlError) {
      //  //Handle your error cases
      //}
    }
  }
  return {
    redirect: {
      destination: "/signup",
      permanent: false,
    },
  };
};
