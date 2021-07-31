import {GraphQLList, GraphQLString} from "graphql";
import {ColorType} from "../typeDefs";
import Color from "../../Models/Color";

const colorData = {
    userId: "",
    name: "",
    value: ""
}

export const UPLOAD_COLOR = {
    type: ColorType,
    args: {
        userId: {type: GraphQLString},
        name: {type: GraphQLString},
        value: {type: GraphQLString}
    },
    async resolve(_: any, args = colorData) {
        const {userId, name, value} = args
        const newColor = new Color({name, value, user: userId, createdAt: new Date().toISOString()})
        try {
            await newColor.save();
            return newColor;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

