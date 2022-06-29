import "../styles/globals.css";
import styles from "../styles/Home.module.css";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apollo";

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
