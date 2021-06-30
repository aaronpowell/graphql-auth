import { ApolloServer } from "apollo-server-azure-functions";
// import { loadSchemaSync } from "@graphql-tools/load";
import { loadFilesSync } from "@graphql-tools/load-files";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { join } from "path";
import resolvers from "./resolvers";
import { HttpRequest } from "@azure/functions";
import {
  isAuthenticated,
  getUserInfo,
} from "@aaronpowell/static-web-apps-api-auth";
import { IsAuthenticatedDirective } from "./directives/isAuthenticatedDirective";
import { IsSelfDirective } from "./directives/isSelfDirective";

const typeDefs = loadFilesSync(
  join(__dirname, "..", "..", "graphql", "schema.graphql")
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ request, ...rest }: { request: HttpRequest }) => {
    return {
      isAuthenticated: isAuthenticated(request),
      user: getUserInfo(request),
    };
  },
  schemaDirectives: {
    isAuthenticated: IsAuthenticatedDirective,
    isSelf: IsSelfDirective,
  },
});

export default server.createHandler();
