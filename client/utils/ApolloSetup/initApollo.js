import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";
import Router from "next/router";
import { isBrowser } from "./isBrowser";

let apolloClient = null;

if (!isBrowser) {
  global.fetch = fetch;
}

const create = (initialState, { getToken }) => {
  const httpLink = createHttpLink({
    uri: process.env.API_URL || "http://localhost:1337/graphql",
    credentials: "include",
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
        if (isBrowser && message.includes("not authenticated")) {
          Router.replace("/login");
        }
      });
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      // headers: {
      //   authorization: token ? `Bearer ${token}` : null,
      // },
      headers: Object.assign(Object.assign({}, headers), {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        cookie: token ? `qid=${token}`:""
      }),
    };
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: errorLink.concat(authLink.concat(httpLink)),
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

export default function initApollo(initialState, options) {
  if (!isBrowser) {
    return create(initialState, options);
  }

  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }
  return apolloClient;
}
