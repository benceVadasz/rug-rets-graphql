import User from "../models/User";
import {UserInputError} from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Color from "../models/Color";
import Design from "../models/Design";
import Post from "../models/Post";
import {ACCESS_TOKEN_SECRET} from "../constants";
import mongoose from 'mongoose';
import {isAuth} from "../utils";

const defaultNewUser = {
    username: "",
    givenName: "",
    familyName: "",
    email: "",
    password: "",
}

const defaultUser = {
    email: "",
    password: "",
}

const colorData = {
    userId: "",
    name: "",
    value: ""
}

const defaultDesignData = {
    name: "",
    colors: [],
    shape: ""
}

const defaultPostData = {
    id: "",
    message: "",
    selectedFile: ""
}

const defaultCommentData = {
    id: "",
    comment: ""
}

const defaultProfileData = {
    username: "",
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    profilePicture: "",
    phone: ""
}

export const Mutation = {
    signUp: async (_: any, {
        username, password, email,
        givenName, familyName
    } = defaultNewUser) => {

        const emailRegistered = await User.findOne({email});
        const takenUsername = await User.findOne({username});

        if (emailRegistered || takenUsername) {
            throw new UserInputError(emailRegistered ? 'Email is already registered' : 'Username is taken');
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({username, givenName, familyName, password: hashedPassword, email});

        const token = jwt.sign({email: user.email, id: user._id},
            ACCESS_TOKEN_SECRET, {expiresIn: '1h'});

        return {
            user,
            token
        };
    },

    signIn: async (_: any, {email, password} = defaultUser) => {
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            throw new UserInputError('User not found', {
                errors: {
                    email: "Email does not exist"
                }
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            throw new UserInputError('Invalid credentials', {
                errors: {
                    email,
                    password
                }
            });
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id},
            ACCESS_TOKEN_SECRET, {expiresIn: '1h'})

        return {
            user: existingUser,
            token
        }
    },
    updateProfile: async (_: any, {username, givenName, familyName,
        email, profilePicture, phone} = defaultProfileData, context: any) => {
        const userId = isAuth(context)
        const updatedProfile = {username, givenName, familyName, email, profilePicture, phone}
        return User.findByIdAndUpdate(userId, updatedProfile, {new: true});
    },
    uploadColor: async (_: any, {value, name} = colorData, context: any) => {
        const userId = isAuth(context)
        const user = await User.findOne({"_id": userId});

        const color = new Color({name, value, user: userId, createdAt: new Date().toISOString()})
        await color.save();

        return {
            color,
            user
        };
    },
    deleteColor: async (_: any, {id} = {id: ""}, context: any) => {
        isAuth(context)
        await Color.findByIdAndDelete(id)
        return true
    },
    uploadDesign: async (_: any, args = defaultDesignData, context: any) => {
        const userId = isAuth(context)
        const user = await User.findOne({"_id": userId});
        const {name, colors, shape} = args

        const design = new Design({name, colors, shape, user: userId, createdAt: new Date().toISOString()})
        await design.save();

        return {
            design,
            user
        };
    },
    uploadPost: async (_: any, {message, selectedFile} = defaultPostData, context: any) => {
        const userId = isAuth(context)
        const user = await User.findOne({"_id": userId});

        const post = new Post({message, selectedFile, userId, username: user.username,
            profilePicture: user.profilePicture, createdAt: new Date().toISOString()})
        await post.save();
        return {post, user};
    },
    updatePost: async (_: any, {id, message, selectedFile} = defaultPostData, context: any) => {
        const userId = isAuth(context)
        const user = await User.findOne({"_id": userId});

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`No post with id: ${id}`);
        }
        const updatedPost = {_id: id, message, selectedFile, user: userId, username: user.username};
        return Post.findByIdAndUpdate(id, updatedPost, {new: true});
    },
    deletePost: async (_: any, {id} = {id: ""}, context: any) => {
        isAuth(context)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`No post with id: ${id}`);
        }
        await Post.findByIdAndDelete(id)
        return true
    },
    likePost: async (_: any, {id} = {id: ""}, context: any) => {
        const userId = isAuth(context)
        const user = await User.findOne({"_id": userId});
        const post = await Post.findById(id);
        if (!post) {
            throw new Error(`No post with the id: ${id}`)
        }
        const index = post.likes.findIndex((id: string) => id === String(userId));

        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter((id: string) => id !== String(userId));
        }

        const updatedPost = await Post.findByIdAndUpdate(id, post, {new: true});

        return {
            post: updatedPost,
            user
        };
    },
    commentPost: async (_: any, {comment, id} = defaultCommentData, context: any) => {
        const userId = isAuth(context)
        const user = await User.findOne({"_id": userId})

        const post = await Post.findById(id)

        if (!mongoose.Types.ObjectId.isValid(id) || !post) {
            throw new Error(`No post with id: ${id}`);
        }

        post.comments.push({"username": user.username, "text": comment, "createdAt": new Date().toISOString()});

        return Post.findByIdAndUpdate(id, post, {new: true});
    }
}

