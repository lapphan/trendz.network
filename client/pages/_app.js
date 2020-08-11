//import App, { Container } from 'next/app'
import React from "react";
import Head from "next/head";
import withApollo from "../utils/ApolloSetup/withApollo";
import { ApolloProvider } from "react-apollo";
import { UserContextProvider } from "../context/userContext";
import {SnackbarProvider} from 'notistack'
import dynamic from "next/dynamic";
const Layout = dynamic(() => import("../components/layout"));
import "../assets/css/blk-design-system-react.css";
import "../assets/css/demo.css";
import "../assets/css/nucleo-icons.css";

const App = ({ Component, pageProps, apolloClient, router }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>Trendz Network</title>

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Staatliches"
        />
      </Head>
      <UserContextProvider>
        <SnackbarProvider>
        <Layout>
          <Component {...pageProps} key={router.route}/>
        </Layout>
        </SnackbarProvider>
      </UserContextProvider>
    </ApolloProvider>
  );
};

// Wraps all components in the tree with the data provider
export default withApollo(App);
