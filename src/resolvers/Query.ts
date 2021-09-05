import User from "../models/User";
import Color from "../models/Color";
import Design from "../models/Design";
import Post from "../models/Post";
import mongoose from "mongoose";
import {isAuth} from "../utils";

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
            return await Post.find({message: { $regex: !searchQuery ? '' : searchQuery, "$options": "i" }})
                .sort({'createdAt': -1})
                .populate({path: 'userId', select: ['username', 'profilePicture', '_id']})
        } catch (e) {
            throw new Error(e.message)
        }
    },
    getPost: async (_: any, {id}: { id: '' }) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`No post with id: ${id}`);
        }
        return Post.findById(id)
            .populate({path: 'userId', select: ['username', 'profilePicture', '_id']});
    },
    getMyPosts: async (_: any, args : null, context: any) => {
        const userId = isAuth(context)
        return Post.find({user: userId});
    },
    getPostsByCreator: async (_: any, args = {id: ""}) => {

        const {id} = args

        const user = await User.findOne({"_id": id});
        const posts = await Post.find({user: id});

        return {
            posts,
            user
        }

    },
    getPostsBySearch: async (_: any, {searchQuery} : {searchQuery: ""}, context: any) => {

        const message = new RegExp(searchQuery, "i");

        return Post.find({$or: [{message}]});
    }
}