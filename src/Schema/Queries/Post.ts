import {GraphQLList, GraphQLString} from "graphql";
import {PostType} from "../typeDefs";
import Post from "../../Models/Post";

export const GET_POSTS = {
    type: new GraphQLList(PostType),
    args: {
        userId: {type: GraphQLString}
    },
    async resolve() {
        try {
            return await Post.find().sort({'createdAt': -1});
        } catch (e) {
            throw new Error(e.message)
        }
    }
}