import User from "../models/User";
import Color from "../models/Color";
import Design from "../models/Design";
import Post from "../models/Post";
import mongoose from "mongoose";

const defaultColor = {
    userId: ""
}

const defaultColorValue = {
    value: ""
}

export const Query = {
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
    getColors: async (_: any, args = defaultColor) => {
        try {
            const {userId} = args
            return await Color.find({user: userId});
        } catch (e) {
            throw new Error(e.message)
        }
    },
    colorExists: async (_: any, args = defaultColorValue) => {
        const {value} = args
        const matches = await Color.find({value});
        return matches.length > 0
    },
    getDesigns: async (_: any, args = {userId: ""}) => {
        try {
            const {userId} = args
            return await Design.find({user: userId});
        } catch (e) {
            throw new Error(e.message)
        }
    },
    getPosts: async () => {
        try {
            return await Post.find().sort({'createdAt': -1});
        } catch (e) {
            throw new Error(e.message)
        }
    },
    getPost: async (_: any, args = {id: ""}, context: any) => {
        const {userId} = context
        if (!userId) {
            throw new Error('Not Authenticated')
        }
        const {id} = args
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`No post with id: ${id}`);
        }
        const user = await User.findOne({"_id": userId});
        const post = await Post.findById(id);

        return {
            post, user
        }
    },
    getPostsByCreator: async (_: any, args = {id: ""}, context: any) => {

        const {id} = args

        const {userId} = context
        if (!userId) {
            throw new Error('Not Authenticated')
        }
        const user = await User.findOne({"_id": id});
        const posts = await Post.find({ user: id });

        return {
            posts,
            user
        }

    }
}