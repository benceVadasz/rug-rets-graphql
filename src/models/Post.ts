import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    message: String,
    selectedFile: String,
    user: String,
    likes: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Post = mongoose.model('post', postSchema)
export default Post;