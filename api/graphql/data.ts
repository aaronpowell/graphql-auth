import { Author, Post, Comment } from "./generated";

export type PostModel = Omit<Post, "author" | "comments" | "comment"> & { authorId: string };
export type CommentModel = Omit<Comment, "author"> & { postId: string, authorId: string };

export const authors: Author[] = [];
export const posts: PostModel[] = [];
export const comments: CommentModel[] = [];
