import User from "../Models/User";
import {UserInputError} from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Color from "../Models/Color";
import Design from "../Models/Design";
import Post from "../Models/Post";
import {ACCESS_TOKEN_SECRET} from "../constants";

const defaultNewUser = {
    username: "",
    givenName: "",
    familyName: "",
    email: "",
    password: "",
    confirmPassword: ""
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
    userId: "",
    name: "",
    colors: []
}

const defaultPostData = {
    userId: "",
    message: "",
    selectedFile: ""
}

export const Mutation = {
    signUp: async (_: any, args = defaultNewUser) => {
        const {username, givenName, familyName, email, password, confirmPassword} = args

        const existingUser = await User.findOne({email});
        if (existingUser) {
            throw new UserInputError('Email is taken', {
                errors: {
                    username: 'This email is taken'
                }
            });
        }
        if (password !== confirmPassword) {
            throw new UserInputError('Passwords do not match', {
                errors: {
                    password: 'Passwords do not match'
                }
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({username, givenName, familyName, password: hashedPassword, email});

        const token = jwt.sign({email: result.email, id: result._id},
            ACCESS_TOKEN_SECRET, {expiresIn: '1h'});

        return {
            user: result,
            token
        };
    },

    signIn: async (_: any, args = defaultUser) => {
        const {email, password} = args

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
                    email: email,
                    password: password
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

    uploadColor: async (_: any, args = colorData, context: any) => {
        const {userId} = context
        if (!userId) {
            throw new Error('Not authenticated')
        }
        const user = await User.findOne({userId});

        const {name, value} = args
        const newColor = new Color({name, value, user: userId, createdAt: new Date().toISOString()})
        try {
            await newColor.save();
            return {
                color: newColor,
                user };
        } catch (error) {
            throw new Error(error.message)
        }
    },

    uploadDesign: async (_: any, args = defaultDesignData, context: any) => {
        const {userId} = context
        if (!userId) {
            throw new Error('Not authenticated')
        }
        const user = await User.findOne({userId});
        const {name, colors} = args
        const newDesign = new Design({name, colors, user: userId, createdAt: new Date().toISOString()})
        try {
            await newDesign.save();
            return {
                design: newDesign,
                user };
        } catch (error) {
            throw new Error(error.message)
        }
    },

    uploadPost: async (_: any, args = defaultPostData, context: any) => {
        const {userId} = context
        if (!userId) {
            throw new Error('Not Authenticated')
        }
        const user = await User.findOne({"_id" : userId});

        const {message, selectedFile} = args
        const newPost = new Post({message, selectedFile, user: userId, createdAt: new Date().toISOString()})
        try {
            await newPost.save();
            return {
                post: newPost,
                user };
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

