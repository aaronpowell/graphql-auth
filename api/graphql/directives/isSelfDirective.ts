import { UserInfo } from "@aaronpowell/static-web-apps-api-auth";
import {
  AuthenticationError,
  SchemaDirectiveVisitor,
} from "apollo-server-azure-functions";
import { GraphQLObjectType, defaultFieldResolver, GraphQLField } from "graphql";
import { Author } from "../generated";
import "./typeExtensions";

export class IsSelfDirective extends SchemaDirectiveVisitor {
  visitObject(type: GraphQLObjectType) {
    this.ensureFieldsWrapped(type);
    type._isSelfRequired = true;
  }

  visitFieldDefinition(
    field: GraphQLField<any, any>,
    details: {
      objectType: GraphQLObjectType;
    }
  ) {
    this.ensureFieldsWrapped(details.objectType);
    field._isSelfRequired = true;
  }

  ensureFieldsWrapped(objectType: GraphQLObjectType) {
    if (objectType._isSelfRequiredWrapped) {
      return;
    }

    objectType._isSelfRequiredWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        const selfRequired =
          field._isSelfRequired || objectType._isSelfRequired;

        if (!selfRequired) {
          return resolve.apply(this, args);
        }

        const context = args[2];

        if (!context.isAuthenticated || !context.user) {
          throw new AuthenticationError(
            "Operation requires an authenticated user"
          );
        }

        const author = args[0] as Author;
        const user: UserInfo = context.user;

        if (author.userId !== user.userId) {
          throw new AuthenticationError(
            "Cannot access data across user boundaries"
          );
        }

        return resolve.apply(this, args);
      };
    });
  }
}
