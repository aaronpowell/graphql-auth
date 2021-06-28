import { useMutation, useQuery } from "@apollo/client";
import marked from "marked";
import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useAuthor } from "../components/AuthorContextProvider";
import {
  CreateCommentDocument,
  CreateCommentMutation,
  GetPostDocument,
  GetPostQuery,
} from "../generated";

type Comments = CreateCommentMutation["createComment"]["comments"];

const NewComment = ({
  postId,
  authorId,
  refreshComments,
}: {
  postId: string;
  authorId: string;
  refreshComments: (comments: Comments) => void;
}) => {
  const [comment, setComment] = useState("");
  const [saveComment, { loading, called, data }] = useMutation(
    CreateCommentDocument
  );
  const submitComment = () => {
    saveComment({
      variables: {
        input: {
          authorId,
          postId,
          comment,
        },
      },
    });
  };

  useEffect(() => {
    if (called && !loading && data) {
      refreshComments(data.createComment.comments);
      setComment("");
    }
  }, [loading, called, data, refreshComments]);

  return (
    <div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button disabled={!comment} onClick={submitComment}>
        Submit
      </button>
    </div>
  );
};

type GetPostData = GetPostQuery["getPost"];

export function Post() {
  const { id } = useParams<{ id: string }>();
  const { loading, data } = useQuery(GetPostDocument, {
    variables: {
      id,
    },
  });
  const [comments, setComments] = useState<Comments>([]);

  const { author } = useAuthor();

  useEffect(() => {
    if (!loading && data && data.getPost) {
      setComments(data.getPost.comments as Comments);
    }
  }, [data, loading]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!data || !data.getPost) {
    return <Redirect to="/" />;
  }

  const refreshComments = (comments: Comments) => {
    setComments(comments);
  };

  const { title, author: postAuthor, body } = data.getPost;

  return (
    <div>
      <section>
        <h1>
          {title} by {postAuthor.name}
        </h1>
        <div dangerouslySetInnerHTML={{ __html: marked(body) }}></div>
      </section>
      <section>
        <h1>Comments</h1>
        {comments.map((comment) => {
          return (
            <div key={comment.id}>
              <div
                dangerouslySetInnerHTML={{ __html: marked(comment.comment) }}
              ></div>
              <p>By {comment.author.name}</p>
            </div>
          );
        })}
        {author && (
          <NewComment
            postId={id}
            authorId={author.id}
            refreshComments={refreshComments}
          />
        )}
      </section>
    </div>
  );
}
