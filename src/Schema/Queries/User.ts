import { GraphQLList } from "graphql";
import {UserType} from "../typeDefs";
import User from "../../Models/User";

export const GET_ALL_USERS = {
    type: new GraphQLList(UserType),
    resolve() {
        return User.find();
    },
};

