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

const Get_FUser = gql`
  query getfposts {
    users {
      fname
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

  return (
    <div className="border bg-zinc-50">
      <Header />
      {data.users.map((user, key) => {
        return (
          <div key={key} className="flex">
            <Link href={`${user.fname}`}>
              <a>{user.fname}</a>
            </Link>
          </div>
        );
      })}
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
