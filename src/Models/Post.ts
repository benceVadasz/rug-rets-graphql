import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    message: String,
    selectedFile: String,
    user: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const Post = mongoose.model('post', postSchema)
export default Post;