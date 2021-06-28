import { useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";
import { GetAllDocument } from "../generated";

export function PostList() {
  const { loading, data } = useQuery(GetAllDocument);

  if (loading) {
    return null;
  }
  return (
    <section>
      <h1>Recent Posts</h1>
      {!data || data.getAllPosts.length === 0 ? (
        <p>No recent posts...</p>
      ) : (
        <ul>
          {data?.getAllPosts.map((p) => (
            <li key={p.id}>
              <Link to={`/post/${p.id}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
