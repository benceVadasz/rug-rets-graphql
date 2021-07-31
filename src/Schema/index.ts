import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {GET_ALL_USERS} from "./Queries/User";
import {SIGN_IN, SIGN_UP} from "./Mutations/User";

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        getAllUsers: GET_ALL_USERS,
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        signUp: SIGN_UP,
        signIn: SIGN_IN
    },
});

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});