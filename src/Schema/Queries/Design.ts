import {GraphQLList, GraphQLString} from "graphql";
import {DesignType} from "../typeDefs";
import Design from "../../Models/Design";

export const GET_DESIGNS = {
    type: new GraphQLList(DesignType),
    args: {
        userId: {type: GraphQLString}
    },
    async resolve(_: any, args = {userId: ""}) {
        try {
            const {userId} = args
            return await Design.find({user: userId});
        } catch (e) {
            throw new Error(e.message)
        }
    }
}