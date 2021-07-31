import {ColorType, PostType} from "../typeDefs";
import {GraphQLString} from "graphql";
import Post from "../../Models/Post";

const defaultPostData = {
    userId: "",
    message: "",
    selectedFile: ""
}

export const UPLOAD_POST = {
    type: PostType,
    args: {
        userId: {type: GraphQLString},
        message: {type: GraphQLString},
        selectedFile: {type: GraphQLString}
    },
    async resolve(_: any, args = defaultPostData) {
        const {userId, message, selectedFile} = args
        const newColor = new Post({message, selectedFile, user: userId, createdAt: new Date().toISOString()})
        try {
            await newColor.save();
            return newColor;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}