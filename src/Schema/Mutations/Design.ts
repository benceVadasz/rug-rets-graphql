import {ColorType, DesignType} from "../typeDefs";
import {GraphQLList, GraphQLString} from "graphql";
import Design from "../../Models/Design";

const defaultDesignData = {
    userId: "",
    name: "",
    colors: []
}

export const UPLOAD_DESIGN = {
    type: DesignType,
    args: {
        userId: {type: GraphQLString},
        name: {type: GraphQLString},
        colors: {type: GraphQLList(GraphQLString)}
    },
    async resolve(_: any, args = defaultDesignData) {
        const {userId, name, colors} = args
        const newDesign = new Design({name, colors, user: userId, createdAt: new Date().toISOString()})
        try {
            await newDesign.save();
            return newDesign;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}