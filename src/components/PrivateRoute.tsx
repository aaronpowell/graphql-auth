import { useUserInfo } from "@aaronpowell/react-static-web-apps-auth";
import React from "react";
import { Redirect, Route } from "react-router-dom";

export function PrivateRoute({ children, ...rest }: { [key: string]: any }) {
  let { loaded, clientPrincipal } = useUserInfo();

  if (!loaded) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loaded && clientPrincipal ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
