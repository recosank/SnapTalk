//import Head from 'next/head'
import Image from "next/image";
//import styles from '../styles/Home.module.css'
import Header from "../components/header";
import authg from "../lib/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import profile from "../images/profile.jpg";
import def from "../images/def.jpg";
import { initializeApollo } from "../lib/apollo";
import HPosts from "../components/posts";

const Get_FUser = gql`
  query getfposts {
    users {
      fname
    }

    allposts {
      title
      user_name
    }
  }
`;
export default function Home() {
  const router = useRouter();
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
  const login_user = "iamhasley";
  //typeof window !== "undefined" ? localStorage.getItem("fantaUser") : "";
  //
  //{data.users.map((user, key) => {
  //  return (
  //    <div key={key} className="flex">
  //      <Link href={`${user.fname}`}>
  //        <a>{user.fname}</a>
  //      </Link>
  //    </div>
  //  );
  //})}

  return (
    <div className="w-full bg-zinc-50">
      <Header />
      <div className="flex mt-7 w-5/12 mx-auto ">
        <div className="mr-10 w-7/12">
          <div className="flex"></div>
          <div>
            {data.allposts.map((post, key) => {
              return (
                <div key={key}>
                  <HPosts data={post} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-5/12 h-screen">
          <div className="flex items-center">
            <Image
              src={profile}
              width="70"
              height="70"
              className="rounded-full"
            />
            <div className="grow mx-3">
              <p className="text-sm">{login_user}</p>
              <p>snowman</p>
            </div>
            <button className="text-lime-800">switch</button>
          </div>
          <div className="mt-2">
            <div className="flex justify-between items-center">
              <p className="text-gray-500">suggestions for you</p>
              <p>see all</p>{" "}
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
        query: Get_FUser,
        //variables: { code: req.headers.cookie },
      });

      console.log(apolloClient);
      //const f = apolloClient.text
      return {
        props: { initialApolloState: await apolloClient.cache.extract() },
      };

      // Handle what you want to do with this data / Just cache it
    } catch (error) {
      console.log("pppp");

      console.log(error);

      //const gqlError = error.graphQLErrors[0];
      //if (gqlError) {
      //  //Handle your error cases
      //}
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
