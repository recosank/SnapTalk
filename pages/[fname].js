//import Head from 'next/head'
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import { useState, useEffect } from "react";
import Header from "../components/header";
import authg from "../lib/auth";
import { useRouter } from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import profile from "../images/profile.jpg";
import def from "../images/def.jpg";
import { initializeApollo } from "../lib/apollo";

const Get_FPost = gql`
  query getfposts($fname: String!) {
    posts(fname: $fname) {
      title
      user_name
    }
    user(fname: $fname) {
      fname
      following
      follow
    }
  }
`;

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
  const router = useRouter();
  //const { data, error, loading } = useQuery(GET_PRODUCT_BY_ID, {     send query with var
  //  variables: { code: VARIABLE },
  //});
  const [isLogin, setisLogin] = useState(false);
  const [isUser, setisUser] = useState(false);
  const [isAllow, setisAllow] = useState(false);

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
    let loginUser = localStorage.getItem("fantaUser");
    loginUser && setisLogin(true);

    isLogin && loginUser == router.asPath.slice(1) && setisUser(true);
    isLogin && qdata.user.follow.includes(loginUser) && setisAllow(true);
  }, [isLogin]);
  return (
    <div className="border bg-zinc-50">
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
              <p className="text-3xl font-thin">{qdata.user.fname}</p>
              {isUser ? (
                <button
                  className="ml-8 px-3 bg-white text-black border font-bold rounded-md"
                  onClick={(e) => {
                    console.log("we are workubg");
                  }}
                >
                  Edit Profile
                </button>
              ) : isAllow ? (
                <>
                  <button className="ml-8 px-3 bg-white text-black border font-bold rounded-md">
                    Message{" "}
                  </button>
                  <button
                    className="ml-8 px-3 bg-white text-black border font-bold rounded-md"
                    onClick={(e) => {
                      remfl(e, `${qdata.user.fname}`);
                    }}
                  >
                    un{" "}
                  </button>
                </>
              ) : (
                <button
                  className="ml-8 px-3 bg-cyan-600 text-white rounded-md"
                  onClick={(e) => {
                    aaddfl(e, `${qdata.user.fname}`);
                  }}
                >
                  Follow
                </button>
              )}
            </div>
            <div className="flex py-4">
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
            <p className="text-base font-semibold">The Big Bang Theory</p>
            <p className="text-base">
              The Official the big bang theory insta account youngsheldon.com
            </p>
          </div>
        </div>
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
                  <Image src={def} className="" width="300" height="300" />{" "}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps = async (ctx) => {
  const { req } = ctx;
  console.log(ctx.params.fname);
  if (req?.headers.cookie) {
    //const tt ={
    //  initialState: null,
    //  ctx :ctx
    //}
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
      //const f = apolloClient.text
      return {
        props: {
          initialApolloState: await apolloClient.cache.extract(),
        },
      };

      // Handle what you want to do with this data / Just cache it
    } catch (error) {
      console.log("pppp");

      console.log(error);

      const gqlError = error.networkErrors;
      if (gqlError) {
        console.log(gqlError);
      }
    }
  }
};
//export const getServerSideProps = async ({req,res}) => {
//
// console.log(req.cookies.token);
//  const user_id = authg(req.cookies.token)
//  const apolloClient = initializeApollo();
//  await apolloClient.query({
//    query: Get_FPost,
//    variables: { code: user_id },
//
//  })
//  console.log('data');
//  console.log(apolloClient);
//
//  return { props: { initialApolloState: apolloClient.cache.extract() } };
//};
