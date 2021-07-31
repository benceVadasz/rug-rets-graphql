import {GraphQLList, GraphQLString, GraphQLBoolean} from "graphql";
import {ColorType} from "../typeDefs";
import Color from "../../Models/Color";

const defaultColor = {
    userId: ""
}

const defaultColorValue = {
    value: ""
}

export const GET_COLORS = {
    type: new GraphQLList(ColorType),
    args: {
        userId: {type: GraphQLString}
    },
    async resolve(_: any, args = defaultColor) {
        try {
            const {userId} = args
            return await Color.find({user: userId});
        } catch (e) {
            throw new Error(e.message)
        }
    }
}

export const CHECK_IF_COLOR_EXISTS = {
    type: GraphQLBoolean,
    args: {
        value: {type: GraphQLString}
    },
    async resolve(_: any, args = defaultColorValue) {
        const {value} = args
        const matches = await Color.find({value});
        return matches.length > 0
    }
}