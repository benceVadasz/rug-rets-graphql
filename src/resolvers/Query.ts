import User from "../Models/User";
import Color from "../Models/Color";
import Design from "../Models/Design";
import Post from "../Models/Post";

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
    }
}