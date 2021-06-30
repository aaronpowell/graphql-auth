import { GraphQLObjectType, defaultFieldResolver, GraphQLField } from "graphql";

declare module "graphql" {
  class GraphQLObjectType {
    _authRequired: boolean;
    _authRequiredWrapped: boolean;
    _isSelfRequired: boolean;
    _isSelfRequiredWrapped: boolean;
  }

  class GraphQLField<TSource, TContext, TArgs = { [key: string]: any }> {
    _authRequired: boolean;
    _isSelfRequired: boolean;
  }
}
