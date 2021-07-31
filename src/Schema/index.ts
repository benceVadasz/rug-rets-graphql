import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {GET_ALL_USERS} from "./Queries/User";
import {SIGN_IN, SIGN_UP} from "./Mutations/User";
import {CHECK_IF_COLOR_EXISTS, GET_COLORS} from "./Queries/Color";
import {UPLOAD_COLOR} from "./Mutations/Color";

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        getAllUsers: GET_ALL_USERS,
        getColors: GET_COLORS,
        colorExists: CHECK_IF_COLOR_EXISTS
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        signUp: SIGN_UP,
        signIn: SIGN_IN,
        uploadColor: UPLOAD_COLOR
    },
});

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});