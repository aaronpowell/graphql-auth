import React, { useEffect } from "react";
import marked from "marked";
import { useState } from "react";
import styles from "./NewPost.module.css";
import { useAuthor } from "../components/AuthorContextProvider";
import { useMutation } from "@apollo/client";
import { CreatePostDocument } from "../generated";
import { useHistory } from "react-router-dom";

export function NewPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { loaded, author } = useAuthor();
  const [submittingPost, setSubmittingPost] = useState(false);
  const history = useHistory();

  const [createPost, { loading, called, data }] =
    useMutation(CreatePostDocument);

  useEffect(() => {
    if (submittingPost && author) {
      createPost({
        variables: {
          input: {
            authorId: author.id,
            body,
            title,
          },
        },
      });
    }
  }, [submittingPost, author, body, title, createPost]);

  useEffect(() => {
    if (called && !loading && data) {
      const postId = data.createPost.id;

      history.push(`/post/${postId}`);
    }
  }, [loading, called, data, history]);

  return (
    <section>
      <h1>New Post</h1>
      <div className={styles.editor}>
        <input
          type="text"
          placeholder="Post Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <h2>{title}</h2>
        <textarea
          className={styles["editor-surface"]}
          onChange={(e) => setBody(e.target.value)}
          value={body}
        ></textarea>
        <div dangerouslySetInnerHTML={{ __html: marked(body) }}></div>
        <button
          className={styles.submit}
          disabled={!body || !title || !loaded}
          onClick={() => setSubmittingPost(true)}
        >
          Submit Post
        </button>
      </div>
    </section>
  );
}
