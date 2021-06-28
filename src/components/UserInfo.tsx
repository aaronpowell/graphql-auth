import React from "react";
import {
  StaticWebAuthLogins,
  Logout,
} from "@aaronpowell/react-static-web-apps-auth";
import { Link } from "react-router-dom";
import { useAuthor } from "./AuthorContextProvider";

export function UserInfo() {
  const { author } = useAuthor();

  if (!author) {
    return (
      <StaticWebAuthLogins
        azureAD={false}
        twitter={false}
        postLoginRedirect="/login-callback"
      />
    );
  }

  return (
    <div>
      <h2>Welcome {author.name}</h2>
      <ul>
        <li>
          <Link to="/post/create">Create a post</Link>
        </li>
        <li>
          <Logout />
        </li>
      </ul>
    </div>
  );
}
