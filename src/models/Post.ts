import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    message: String,
    selectedFile: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    username: String,
    likes: { type: [String], default: [] },
    comments: {
        type: {"username" : String, "text": String},
        default: [],
        createdAt: {type: Date, default: new Date()}
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    profilePicture: String
})

const Post = mongoose.model('post', postSchema)
export default Post;