import { authors, comments, PostModel, posts } from "./data";
import { Resolvers } from "./generated";

const resolvers: Resolvers = {
  Query: {
    getPost(_, { id }) {
      return posts.find((p) => p.id === id);
    },
    getAllPosts(_, { count }) {
      return posts.slice(0, count);
    },
    getAuthor(_, { userId }) {
      return authors.find((a) => a.userId === userId);
    },
  },
  Mutations: {
    createAuthor(_, { input }) {
      authors.push({
        id: (authors.length + 1).toString(),
        ...input,
      });

      return authors[authors.length - 1];
    },
    createComment(_, { input }) {
      const post = posts.find((p) => p.id === input.postId);
      if (!post) {
        throw new Error("Post not found");
      }

      const author = authors.find((a) => a.id === input.authorId);
      if (!author) {
        throw new Error("Author not found");
      }

      comments.push({
        ...input,
        id: (comments.length + 1).toString(),
      });

      return post;
    },
    createPost(_, { input }) {
      const author = authors.find((a) => a.id === input.authorId);
      if (!author) {
        throw new Error("Author not found");
      }

      const post: PostModel = {
        ...input,
        id: (posts.length + 1).toString(),
      };

      posts.push(post);
      return post;
    },
  },

  Post: {
    author(post) {
      return authors.find((a) => a.id === post.authorId);
    },
    comment(post, { id }) {
      return comments.find((c) => c.id === id && c.postId === post.id);
    },
    comments(post) {
      return comments.filter((c) => c.postId === post.id);
    },
  },

  Comment: {
    author(comment) {
      return authors.find((a) => a.id === comment.authorId);
    },
  },
};

export default resolvers;
