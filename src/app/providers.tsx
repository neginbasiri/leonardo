"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apolloClient";
import { UserProvider } from "../contexts/UserContext";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <UserProvider>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </UserProvider>
    </ChakraProvider>
  );
}