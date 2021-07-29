import { GraphQLID, GraphQLString } from "graphql";
import {UserType} from "../TypeDefs/User";

export const CREATE_USER = {
    type: UserType,
    args: {
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(parent: any, args: any) {
        const { name, username, password } = args;
        // await Users.insert({ name, username, password });
        return args;
    },
};

// export const DELETE_USER = {
//     type: MessageType,
//     args: {
//         id: { type: GraphQLID },
//     },
//     async resolve(parent: any, args: any) {
//         const id = args.id;
//         await Users.delete(id);
//
//         return { successful: true, message: "DELETE WORKED" };
//     },
// };