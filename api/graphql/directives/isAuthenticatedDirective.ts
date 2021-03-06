import {
  AuthenticationError,
  SchemaDirectiveVisitor,
} from "apollo-server-azure-functions";
import { GraphQLObjectType, defaultFieldResolver, GraphQLField } from "graphql";
import "./typeExtensions";

const isAuthenticatedResolver =
  (
    field: GraphQLField<any, any>,
    objectType: GraphQLObjectType,
    resolve: typeof defaultFieldResolver
  ): typeof defaultFieldResolver =>
  (...args) => {
    const authRequired = field._authRequired || objectType._authRequired;

    if (!authRequired) {
      return resolve.apply(this, args);
    }

    const context = args[2];

    if (!context.isAuthenticated) {
      throw new AuthenticationError("Operation requires an authenticated user");
    }
    return resolve.apply(this, args);
  };

export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  visitObject(type: GraphQLObjectType) {
    this.ensureFieldsWrapped(type);
    type._authRequired = true;
  }

  visitFieldDefinition(
    field: GraphQLField<any, any>,
    details: {
      objectType: GraphQLObjectType;
    }
  ) {
    this.ensureFieldsWrapped(details.objectType);
    field._authRequired = true;
  }

  ensureFieldsWrapped(objectType: GraphQLObjectType) {
    if (objectType._authRequiredWrapped) {
      return;
    }
    objectType._authRequiredWrapped = true;

    const fields = objectType.getFields();

    for (const fieldName of Object.keys(fields)) {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = isAuthenticatedResolver(field, objectType, resolve);
    }
  }
}
