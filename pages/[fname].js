import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/header";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import profile from "../images/profile.jpg";
import def from "../images/def.jpg";
import { initializeApollo } from "../lib/apollo";
import useSWR from "swr";
import request from "graphql-request";

const Get_FPost = gql`
  query getfposts($fname: String!) {
    posts(fname: $fname) {
      title
      user_name
    }
    user(fname: $fname) {
      fname
      isopen
      pname
      following
      follow
    }
  }
`;
const Get_FUser = `
  {
  getFo
  }`;

const Add_Fl = gql`
  mutation addFlll($fname: String!) {
    addfl(fname: $fname)
  }
`;
const Rem_Fl = gql`
  mutation remFlll($fname: String!) {
    remfl(fname: $fname)
  }
`;
export default function account() {
  const [isLogin, setisLogin] = useState(false);
  const [isUser, setisUser] = useState(false);
  const [isAllow, setisAllow] = useState(false);
  const fetcher = (query) => request("/api/graphql", query);
  const router = useRouter();
  const { data, error } = useSWR(Get_FUser, fetcher);
  console.log("swr data");
  console.log(data);
  console.log(error);
  const {
    loading: qloading,
    error: qerror,
    data: qdata,
  } = useQuery(Get_FPost, {
    variables: { fname: router.asPath.slice(1) },
  });
  if (qloading) {
    return <div>Loading...</div>;
  }
  if (qerror) {
    console.error(qerror);
    return <div>Error!</div>;
  }
  if (qdata) {
    console.log(qdata);
  }
  const [adfl, { data: md, loading: ml, error: me }] = useMutation(Add_Fl);
  const aaddfl = (e, user) => {
    e.preventDefault();
    adfl({
      variables: {
        fname: user,
      },
    });
  };
  const [rmfl, { data: mrd, loading: mrl, error: mre }] = useMutation(Rem_Fl);
  const remfl = (e, user) => {
    e.preventDefault();
    rmfl({
      variables: {
        fname: user,
      },
    });
  };
  useEffect(() => {
    let loginUser = JSON.parse(localStorage.getItem("fantaUser")).f;
    loginUser && setisLogin(true);
    isLogin && loginUser == router.asPath.slice(1) && setisUser(true);
    isLogin && qdata.user.follow.includes(loginUser) && setisAllow(true);
  }, [isLogin, isAllow]);

  return (
    <div className="border bg-slate-50">
      <Header />
      <div className="container  w-1/2 mx-auto mt-8">
        <div className="flex">
          <div className="w-2/6 pl-20 pb-5">
            <Image
              src={profile}
              className="rounded-full"
              width="150"
              height="150"
            />
          </div>
          <div className="w-2/5">
            <div className="flex">
              <p className="text-3xl font-normal text-gray-900">
                {qdata.user.fname}
              </p>
              {isUser ? (
                <div className="flex gap-4">
                  <button
                    className="ml-8 px-3 text-black border font-bold rounded-md"
                    onClick={(e) => {
                      router.push("/accounts/edit");
                    }}
                  >
                    Edit Profile
                  </button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    onClick={(e) => router.push("/accounts/edit")}
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : isAllow ? (
                <>
                  <button
                    className="ml-10 px-3 bg-white text-black border font-bold rounded-md"
                    onClick={(e) => router.push(`direct/${router.query.fname}`)}
                  >
                    Message{" "}
                  </button>
                  <button
                    className="ml-8 px-3 bg-white text-black border font-bold rounded-md"
                    onClick={(e) => {
                      setisAllow(false);
                      remfl(e, `${qdata.user.fname}`);
                    }}
                  >
                    unfollow{" "}
                  </button>
                </>
              ) : !qdata.user.isopen ? (
                <button
                  className="ml-8 px-3 bg-cyan-600 text-white rounded-md"
                  onClick={(e) => {
                    aaddfl(e, `${qdata.user.fname}`);
                    setisAllow(true);
                  }}
                >
                  Follow
                </button>
              ) : (
                <>
                  <button
                    className="ml-8 px-3 bg-white text-black border font-bold rounded-md"
                    onClick={(e) => router.push(`direct/${router.query.fname}`)}
                  >
                    Message{" "}
                  </button>
                  <button
                    className="ml-8 px-3 bg-cyan-600 text-white rounded-md"
                    onClick={(e) => {
                      aaddfl(e, `${qdata.user.fname}`);
                    }}
                  >
                    Follow
                  </button>
                </>
              )}
            </div>
            <div className="flex py-4 text-center">
              <p className="mr-9 text-sm">
                {" "}
                <span className="font-semibold text-md">
                  {qdata.posts.length}
                </span>{" "}
                posts
              </p>
              <p className="mr-9 text-sm ">
                <span className="font-semibold text-md">
                  {qdata.user.follow.length}
                </span>{" "}
                followers
              </p>
              <p className="mr-9 text-sm ">
                <span className="font-semibold text-md">
                  {qdata.user.following.length}
                </span>{" "}
                following
              </p>
            </div>
            <p className="text-base font-semibold">{qdata.user.pname}</p>
            <p className="text-base">
              The Official the big bang theory insta account youngsheldon.com
            </p>
          </div>
        </div>
        {(isAllow || qdata.user.isopen || isUser) && (
          <div className="border-t-2 mt-14">
            <div className="flex justify-center">
              <p className="border-t-2 mr-12 border-black py-2.5">POSTS</p>
              <p className="border-t-2 mr-12 border-black py-2.5">VIDEOS</p>
              <p className="border-t-2 mr-12 border-black py-2.5">TAGGED</p>
            </div>
            <div className="grid items grid-cols-3 gap-7">
              {qdata.posts.map((i, id) => {
                return (
                  <div className="border" key={id}>
                    {" "}
                    <Image
                      src={def}
                      className=""
                      width="300"
                      height="300"
                    />{" "}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
        query: Get_FPost,
        variables: { fname: ctx.params.fname },
      });
      console.log(apolloClient);
      return {
        props: {
          initialApolloState: await apolloClient.cache.extract(),
        },
      };
    } catch (error) {
      console.log("pppp");

      console.log(error);

      const gqlError = error.networkErrors;
      if (gqlError) {
        console.log(gqlError);
      }
    }
  }

  return {
    redirect: {
      destination: "/signup",
      permanent: false,
    },
  };
};
