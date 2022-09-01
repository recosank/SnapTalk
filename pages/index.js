import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/header";
import authg from "../lib/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import profile from "../images/profile.jpg";
import def from "../images/def.jpg";
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
export default function Home(fs) {
  const router = useRouter();
  const [login_user, setlogin_user] = useState({});
  //const { data, error, loading } = useQuery(GET_PRODUCT_BY_ID, {     send query with var
  //  variables: { code: VARIABLE },
  //});
  const { loading, error, data } = useQuery(Get_FUser);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }
  if (data) {
    console.log(data);
  }
  useEffect(() => {
    const l =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("fantaUser"))
        : "";
    setlogin_user(l);
  }, []);
  const client = useApolloClient();
  const addLike = (data) => {
    const datat = client.readQuery({
      query: Get_FUser,
    });
    console.log("cache data");
    console.log(datat);

    const all = client.writeQuery({
      query: Get_FUser,
      data: {
        allposts: datat.allposts.filter((i) => {
          if (i.puid === data.updateAddLike.puid) {
            console.log("here");
            console.log(i);

            i.likes = [...data.updateAddLike.likes];
          }
          return i;
        }),
        getFl: [...datat.getFl],
        users: [...datat.users],
      },
    });
    const datap = client.readQuery({
      query: Get_pUser,
    });
    console.log(datap);
  };
  console.log(client);
  const debby = client.readQuery({
    query: Get_FUser,
    //variables: {
    //  fname: router.asPath.slice(1),
    //},
  });
  if (debby) {
    console.log("debby");
    //console.log(debby);
    //console.log(fs);
  }

  return (
    <div className="w-full bg-slate-50">
      <Header />
      <div className={`flex mt-7 ${styles.homeCard} mx-auto`}>
        <div className="mr-10 w-7/12">
          {data.getFl.length != 0 && (
            <div
              className={`flex p-2 w-full bg-white border rounded-lg ${styles.hdnscrollbar} overflow-x-auto overscroll-x-none`}
            >
              {data.getFl.map((user, key) => {
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
            {debby.allposts.map((post, key) => {
              return (
                <div key={key}>
                  <HPosts data={post} l={addLike} />
                </div>
              );
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
              <p className="text-xs">See All</p>{" "}
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
      console.log(apolloClient);
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
