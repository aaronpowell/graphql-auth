import {
  UserInfoContextProvider,
  useUserInfo,
} from "@aaronpowell/react-static-web-apps-auth";
import { useLazyQuery } from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { GetAuthorDocument, GetAuthorQuery } from "../generated";

type AuthorQueryResponse = GetAuthorQuery["getAuthor"];

type AuthorContextInfo = {
  loaded: boolean;
  author: AuthorQueryResponse;
};

const AuthorContext = createContext<AuthorContextInfo>({
  loaded: false,
  author: null,
});

const AuthorContextProvider = ({ children }: { children: JSX.Element }) => {
  const { loaded, clientPrincipal } = useUserInfo();
  const [author, setAuthorInfo] = useState<AuthorQueryResponse>(null);

  const [query, { loading, called, data }] = useLazyQuery(GetAuthorDocument);

  useEffect(() => {
    if (!loaded && clientPrincipal) {
      query({ variables: { userId: clientPrincipal.userId } });
    }
  }, [clientPrincipal, query, loaded]);

  useEffect(() => {
    if (called && data && data.getAuthor) {
      setAuthorInfo(data.getAuthor);
    }
  }, [called, data]);

  return (
    <AuthorContext.Provider value={{ loaded: loaded ? !loading : false, author }}>
      {children}
    </AuthorContext.Provider>
  );
};

const useAuthor = () => useContext(AuthorContext);

const AuthorIdentity = ({ children }: { children: JSX.Element }) => {
  return (
    <UserInfoContextProvider>
      <AuthorContextProvider>{children}</AuthorContextProvider>
    </UserInfoContextProvider>
  );
};

export { AuthorIdentity, useAuthor };
