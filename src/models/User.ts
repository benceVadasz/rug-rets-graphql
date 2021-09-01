import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    givenName: {
        type: String,
        required: true,
    },
    familyName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    id: {
        type: String,
    },
    profilePicture: String
})

export default mongoose.model('User', userSchema)