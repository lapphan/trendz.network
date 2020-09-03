import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
import { setContext } from "apollo-link-context";


let apolloClient = null;

if (typeof window === "undefined") {
  global.fetch = fetch;
}

const create = (initialState, headers) => {
  const isBrowser = typeof window !== "undefined";

  const httpLink = createHttpLink({
    uri: process.env.API_URL + "/graphql" || "http://localhost:1337/graphql",
  });

  const authLink = setContext((_, previousContext) => {
    const cachedData = JSON.parse(localStorage.getItem("userInfo") || "");
    const token = cachedData.jwt;
    return {
        headers: Object.assign(Object.assign({}, headers), {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }),
    };
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

export default function initApollo(initialState, headers) {
  if (typeof window === "undefined") {
    return create(initialState, headers);
  }

  if (!apolloClient) {
    apolloClient = create(initialState,headers);
  }
  return apolloClient;
}
