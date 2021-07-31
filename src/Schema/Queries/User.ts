import { GraphQLList } from "graphql";
import { UserType } from "../TypeDefs/User";
import User from "../../Models/User";

export const GET_ALL_USERS = {
    type: new GraphQLList(UserType),
    resolve() {
        return ['nodemon']
        // return Users.find();
    },
};