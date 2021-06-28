import { useUserInfo } from "@aaronpowell/react-static-web-apps-auth";
import { ClientPrincipal } from "@aaronpowell/react-static-web-apps-auth/build/UserInfoContext";
import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuthor } from "../components/AuthorContextProvider";
import { CreateAuthorDocument } from "../generated";

type AuthorCreatorProps = {
  clientPrincipal: ClientPrincipal;
};

function AuthorCreator(props: AuthorCreatorProps) {
  const [createAuthor, { loading, called, data }] =
    useMutation(CreateAuthorDocument);

  useEffect(() => {
    if (!called) {
      createAuthor({
        variables: {
          input: {
            name: props.clientPrincipal.userDetails,
            userId: props.clientPrincipal.userId,
          },
        },
      });
    }
  }, [called, createAuthor, props.clientPrincipal]);

  if (!loading && called && data) {
    return <Redirect to="/" />;
  }

  return <h1>Loading...</h1>;
}

function LoginCallback() {
  const { loaded, clientPrincipal } = useUserInfo();
  const { author } = useAuthor();

  if (!loaded) {
    return <h1>Loading...</h1>;
  }

  if (author || !clientPrincipal) {
    return <Redirect to="/" />;
  }

  return <AuthorCreator clientPrincipal={clientPrincipal} />;
}

export default LoginCallback;
