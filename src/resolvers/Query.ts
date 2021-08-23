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
        const colors = await Color.find({user: userId})
        return colors

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
    getPosts: async () => {
        try {
            const posts = await Post.find().sort({'createdAt': -1});
            return {posts}
        } catch (e) {
            throw new Error(e.message)
        }
    },
    getPost: async (_: any, {id}: { id: '' }, context: any) => {
        const userId = isAuth(context)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`No post with id: ${id}`);
        }
        const user = await User.findOne({"_id": userId});
        const post = await Post.findById(id);

        return {
            post, user
        }
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