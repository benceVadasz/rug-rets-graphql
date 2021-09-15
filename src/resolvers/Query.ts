import User from "../models/User";
import Color from "../models/Color";
import Design from "../models/Design";
import Post from "../models/Post";
import mongoose from "mongoose";
import {isAuth} from "../utils";
import Message from "../models/Message";

const defaultColorValue = {
    value: ""
}

export const Query = {
    me: async (_: any, args: null, context: any) => {
        const userId = isAuth(context)
        return User.findById(userId)
    },
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            User.find({}, (err, result) => {
                if (err) {
                    console.log(err)
                    return reject(err)
                }
                return resolve(result)
            })
        })
    },
    getColors: async (_: any, args: null, context: any) => {
        const userId = isAuth(context)
        return Color.find({user: userId});
    },
    colorExists: async (_: any, args = defaultColorValue) => {
        const {value} = args
        const matches = await Color.find({value});
        return matches.length > 0
    },
    getDesigns: async (_: any, args: null, context: any) => {
        const userId = isAuth(context)
        return Design.find({user: userId});
    },
    getPosts: async (_: any, {searchQuery}: { searchQuery: '' }) => {
        try {
            return await Post.find({message: {$regex: !searchQuery ? '' : searchQuery, "$options": "i"}})
                .sort({'createdAt': -1})
                .populate({
                    path: 'userId',
                    select: ['username', 'profilePicture', '_id', 'givenName', 'familyName', 'email']
                })
        } catch (e) {
            throw new Error(e.message)
        }
    },
    getPost: async (_: any, {id}: { id: '' }) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`No post with id: ${id}`);
        }
        return Post.findById(id)
            .populate({
                path: 'userId',
                select: ['username', 'profilePicture', '_id', 'givenName', 'familyName', 'email']
            });
    },
    getPostsGroupedByUsers: async () => {
        return Post.find({})
            .populate({
                path: 'userId',
                select: ['username', 'profilePicture', '_id', 'givenName', 'familyName', 'email']
            });
    },
    getMyPosts: async (_: any, args: null, context: any) => {
        const userId = isAuth(context)
        return Post.find({user: userId});
    },
    getPostsByCreator: async (_: any, args = {username: ""}) => {
        const {username} = args
        const user = await User.findOne({username})
        return Post.find({userId: user._id})
            .populate({
                path: 'userId',
                select: ['username', 'profilePicture', '_id', 'givenName', 'familyName', 'email']
            });
    },
    getPostsBySearch: async (_: any, {searchQuery}: { searchQuery: "" }, context: any) => {

        const message = new RegExp(searchQuery, "i");

        return Post.find({$or: [{message}]});
    },
    getMessages: async (_: any, {mate}: { mate: "" }, context: any) => {
        const userId = isAuth(context)

        return Message.find({
            $or: [
                {$and: [{'from': mate}, {'to': userId}]},
                {$and: [{'to': mate}, {'from': userId}]}
            ]
        }).sort({'createdAt': -1})
            .populate({path: 'to', select: ['username', 'profilePicture', '_id', 'givenName', 'familyName', 'email']})
            .populate({
                path: 'from',
                select: ['username', 'profilePicture', '_id', 'givenName', 'familyName', 'email']
            });

    }
}